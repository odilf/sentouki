use std::{
    future::Future,
    path::{Path, PathBuf},
};

use color_eyre::eyre;
use sqlx::SqlitePool;

use crate::entry::Entry;

#[derive(Debug, Clone, Copy)]
pub struct Options {
    pub ignore_dotfiles: bool,
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
    opts: Options,
) -> impl Future<Output = eyre::Result<Option<Entry>>> + Send {
    async move {
        let starts_with_dot = || {
            path.file_name()
                .map(|name| name.to_string_lossy().starts_with("."))
                .unwrap_or(false)
        };

        if opts.ignore_dotfiles && starts_with_dot() {
            eyre::bail!("Ignoring dotfiles is enabled, and the path is a dotfile")
        }

        if let Some(file_data) = try_cache_file(&path, &pool).await? {
            Ok(Some(file_data))
        } else {
            let data = cache_directory(&path, &pool, &opts).await?;
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
) -> eyre::Result<Option<Entry>> {
    let Some(entry) = Entry::from_file(path).await? else {
        return Ok(None);
    };

    entry.cache(pool).await?;

    Ok(Some(entry))
}

/// Caches the file at `path`.
///
/// If `path` contains a file, it returns `Err`.
async fn cache_directory(path: &Path, pool: &SqlitePool, opts: &Options) -> eyre::Result<Entry> {
    let directory = std::fs::read_dir(path)?;

    let mut tasks = Vec::new();
    for entry in directory {
        let path = entry?.path();
        tasks.push(tokio::spawn(cache(path, pool.clone(), *opts)))
    }

    let mut children = Vec::with_capacity(tasks.len());
    for task in tasks {
        if let Some(data) = task.await?? {
            children.push(data);
        }
    }

    Entry::from_children(path, children.as_slice())
}
