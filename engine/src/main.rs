use clap::Parser;
use color_eyre::eyre;
use tracing_subscriber::{fmt, prelude::*, EnvFilter};

use sentouki_engine::{cache, Options};

#[tokio::main]
async fn main() -> eyre::Result<()> {
    let subscriber = tracing_subscriber::registry()
        .with(fmt::layer())
        .with(EnvFilter::from_default_env());

    tracing::subscriber::set_global_default(subscriber)?;

    let options = Options::try_parse()?;

    let pool = sqlx::SqlitePool::connect("sqlite:../local.db").await?;

    let root = options.root.clone();
    cache(root, pool, options.into()).await?;

    Ok(())
}
