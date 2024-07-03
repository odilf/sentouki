use std::{
    fs,
    hash::{DefaultHasher, Hash, Hasher as _},
    path::{Path, PathBuf},
    process::Output,
    sync::Arc,
};

use color_eyre::eyre::{self, ContextCompat as _};
use sqlx::{sqlite::SqliteRow, Row, SqlitePool};
use time::OffsetDateTime;

use crate::Options;

#[derive(Debug, Clone, Hash)]
pub struct DateRange {
    pub start: OffsetDateTime,
    pub end: OffsetDateTime,
}

#[derive(Debug, Clone, Hash)]
pub enum Date {
    Range(DateRange),
    Single(OffsetDateTime),
    /// For empty directories
    None,
}

impl Date {
    pub fn range(start: OffsetDateTime, end: OffsetDateTime) -> Self {
        Date::Range(DateRange { start, end })
    }

    pub fn start(&self) -> Option<&OffsetDateTime> {
        Some(match self {
            Date::Range(range) => &range.start,
            Date::Single(date) => date,
            Date::None => return None,
        })
    }

    pub fn end(&self) -> Option<&OffsetDateTime> {
        Some(match self {
            Date::Range(range) => &range.end,
            Date::Single(date) => date,
            Date::None => return None,
        })
    }
}

/// An entry in the cache.
///
/// We have a generic `H` parameter, so that we can initialize it without a hash and
/// then hash it, using [`Entry::hashed`].
#[derive(Debug, Clone, Hash)]
pub struct Entry<H = String> {
    pub path: PathBuf,
    pub size: i64,
    pub mime_type: String,
    pub date: Date,
    pub hash: H,
}

/// Gets the [MIME type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types)
/// of the path, using the [`file`](https://man7.org/linux/man-pages/man1/file.1.html) command.
async fn mime_type(path: &Path) -> eyre::Result<String> {
    tracing::debug!(?path, "getting mime type");

    // One might think using `tokio::process` is better, but that makes it so that there are too
    // many files opened at once. Either way, it is sufficiently fast where the overhead of async
    // might make it, in fact, worse.
    let Output { stdout, .. } = std::process::Command::new("file")
        .arg("--brief")
        .arg("--mime-type")
        .arg(path)
        .output()?;

    Ok(String::from_utf8(stdout)?)
}

fn compute_hash<T: Hash>(data: &T) -> String {
    let mut s = DefaultHasher::new();
    data.hash(&mut s);
    s.finish().to_string()
}

impl Entry<()> {
    pub fn hashed(self) -> Entry {
        let hash = compute_hash(&self);

        Entry {
            path: self.path,
            date: self.date,
            mime_type: self.mime_type,
            size: self.size,
            hash,
        }
    }
}

impl Entry {
    /// Gets the necessary data from a file.
    ///
    /// It returns `Err` only if something unexpected goes
    /// wrong. If the path has a directory it returns `Ok(None)`.
    pub async fn from_file(path: &Path) -> eyre::Result<Option<Self>> {
        tracing::debug!(?path, "opening file");
        if path.is_dir() {
            return Ok(None);
        }

        let metadata = fs::metadata(path)?;

        Ok(Some(
            Entry {
                path: path.to_owned(),
                size: metadata.len() as i64,
                mime_type: mime_type(path).await?,
                date: Date::Single(OffsetDateTime::from(metadata.created()?)),
                hash: (),
            }
            .hashed(),
        ))
    }

    /// Gets the necessary data for a directory from its children.
    pub fn from_children(path: &Path, children: &[Self]) -> eyre::Result<Self> {
        let size = children.iter().map(|child| child.size).sum();

        let date = {
            let start = children.iter().filter_map(|child| child.date.start()).min();
            let end = children.iter().filter_map(|child| child.date.end()).max();

            match (start, end) {
                (Some(&start), Some(&end)) => Date::range(start, end),
                _ => Date::None,
            }
        };

        let result = Entry {
            path: path.to_owned(),
            size,
            mime_type: "directory".to_string(),
            date,
            hash: (),
        };

        Ok(result.hashed())
    }

    /// Gets the necessary data for a path from the database.
    ///
    /// If the path is not in the database it returns `Ok(None)`. `Err` is only returned if there
    /// is an error when fetching the database.
    pub async fn from_database(path: &Path, pool: SqlitePool) -> eyre::Result<Option<Self>> {
        let entry: Option<Entry> = sqlx::query_as("SELECT * FROM file_cache WHERE path = $1;")
            .bind(path.to_str().wrap_err("Found not valid UTF-8 in path")?)
            .fetch_optional(&pool)
            .await?;

        let Some(entry) = entry else {
            return Ok(None);
        };

        Ok(Some(entry))
    }

    /// Caches the file in the database.
    ///
    /// It uses [`OffsetDateTime::now_utc`] to store the time of the caching in the db.
    pub async fn cache(&self, pool: &SqlitePool, options: Arc<Options>) -> eyre::Result<()> {
        let name = self
            .path
            .file_name()
            .wrap_err("Can't find name of file {self.path:?}")?
            .to_string_lossy();

        let prefixed_path = self.path.strip_prefix(options.root.to_owned())?;
        let path = prefixed_path.to_string_lossy();

        let parent = prefixed_path
            .parent()
            .map(|parent| parent.to_string_lossy());

        let date_start = self.date.start().map(|d| d.unix_timestamp());
        let date_end = self.date.end().map(|d| d.unix_timestamp());

        tracing::trace!(?path, ?self, "caching file");

        // Delete the file if it already exists, to update it
        // TODO: Look into just doing one update instead of deleting.
        // I think it might be the same because you either do DELETE and INSERT or SELECT and
        // UPDATE. So it might not be more efficient. But I'm not sure.
        sqlx::query!(
            r"
                DELETE FROM file_cache
                WHERE path = $1;
            ",
            path,
        )
        .execute(pool)
        .await?;

        // TODO: Maybe make it `now_local`, but that has errors involved which
        // need to be handled correctly.
        let now = OffsetDateTime::now_utc().unix_timestamp();

        sqlx::query!(
            r"
                INSERT 
                INTO file_cache (name, path, size, mime_type, date_start, date_end, hash, parent_path, date_cached) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
            ",
            name,
            path,
            self.size,
            self.mime_type,
            date_start,
            date_end,
            self.hash,
            parent,
            now,
        )
        .execute(pool)
        .await?;

        Ok(())
    }
}

impl sqlx::FromRow<'_, SqliteRow> for Entry {
    fn from_row(row: &SqliteRow) -> Result<Self, sqlx::Error> {
        Ok(Self {
            path: PathBuf::from(row.try_get::<String, _>("path")?),
            date: Date::range(row.try_get("date_start")?, row.try_get("date_end")?),
            size: row.try_get("size")?,
            mime_type: row.try_get("mime_type")?,
            hash: row.try_get("hash")?,
        })
    }
}
