use std::{
    future::Future,
    path::{Path, PathBuf},
    sync::Arc,
};

use clap::Parser;
use color_eyre::eyre;
use sqlx::SqlitePool;

use crate::entry::Entry;

#[derive(Debug, Clone, Parser)]
#[clap(author, version, about)]
pub struct Options {
    /// The root from where to start caching
    pub root: PathBuf,

    #[clap(long, short('d'))]
    /// Whether to cache dotfiles (e.g., `.git`)
    pub include_dotfiles: Option<bool>,
}

impl Options {
    pub fn ignore_dotfiles(&self) -> bool {
        self.include_dotfiles.unwrap_or(false)
    }
}

/// Generates the cache for the tree of files below and including `path`.
///
/// If the files have changed, it will update the cache.
///
/// Returns `Err` only for unexpected errors. It returns `Ok(None)` if the file was decided not to
/// be cached (e.g., if we're ignoring the dotfiles).
// Allowing this lint because we need to specify that it is Send. Otherwise it complains.
#[allow(clippy::manual_async_fn)]
pub fn cache(
    path: PathBuf,
    pool: SqlitePool,
    options: Arc<Options>,
) -> impl Future<Output = eyre::Result<Option<Entry>>> + Send {
    async move {
        let starts_with_dot = || {
            path.file_name()
                .map(|name| name.to_string_lossy().starts_with("."))
                .unwrap_or(false)
        };

        if options.ignore_dotfiles() && starts_with_dot() {
            return Ok(None);
        }

        if let Some(file_data) = try_cache_file(&path, &pool, Arc::clone(&options)).await? {
            Ok(Some(file_data))
        } else {
            let data = cache_directory(&path, &pool, options).await?;
            Ok(Some(data))
        }
    }
}

/// Caches the file at `path`.
///
/// If `path` contains a directory, it returns `Ok(None)`.
async fn try_cache_file(
    path: &Path,
    pool: &SqlitePool,
    options: Arc<Options>,
) -> eyre::Result<Option<Entry>> {
    let Some(entry) = Entry::from_file(path).await? else {
        return Ok(None);
    };

    entry.cache(pool, options).await?;

    Ok(Some(entry))
}

/// Caches the file at `path`.
///
/// If `path` contains a file, it returns `Err`.
async fn cache_directory(
    path: &Path,
    pool: &SqlitePool,
    options: Arc<Options>,
) -> eyre::Result<Entry> {
    let directory = std::fs::read_dir(path)?;

    let mut tasks = Vec::new();
    for entry in directory {
        let path = entry?.path();
        tasks.push(tokio::spawn(cache(
            path,
            pool.clone(),
            Arc::clone(&options),
        )))
    }

    let mut children = Vec::with_capacity(tasks.len());
    for task in tasks {
        if let Some(data) = task.await?? {
            children.push(data);
        }
    }

    let entry = Entry::from_children(path, children.as_slice())?;

    entry.cache(pool, options).await?;

    Ok(entry)
}
