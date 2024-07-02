use std::path::PathBuf;

use clap::Parser;
use color_eyre::eyre;
use tracing_subscriber::{fmt, prelude::*, EnvFilter};

use sentouki_engine::{cache, Options};

#[derive(Debug, Clone, Parser)]
#[clap(author, version, about)]
struct Args {
    root: PathBuf,

    #[clap(long, short('d'), default_value = "false")]
    /// Whether to cache dotfiles (e.g., `.git`)
    cache_dotfiles: bool,
}

impl From<&Args> for Options {
    fn from(value: &Args) -> Self {
        Options {
            ignore_dotfiles: !value.cache_dotfiles,
        }
    }
}

#[tokio::main]
async fn main() -> eyre::Result<()> {
    let subscriber = tracing_subscriber::registry()
        .with(fmt::layer())
        .with(EnvFilter::from_default_env());

    tracing::subscriber::set_global_default(subscriber)?;

    let args = Args::try_parse()?;

    let pool = sqlx::SqlitePool::connect("sqlite:../local.db").await?;
    
    let opts = Options::from(&args);
    cache(args.root, pool, opts).await?;

    Ok(())
}
