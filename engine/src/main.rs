use clap::Parser;
use color_eyre::eyre;
use tracing_subscriber::EnvFilter;

use sentouki_engine::{cache, Options};

#[tokio::main]
async fn main() -> eyre::Result<()> {
    let file_appender = tracing_appender::rolling::hourly("./logs", "sentouki.log");

    let (non_blocking, _guard) = tracing_appender::non_blocking(file_appender);

    tracing_subscriber::fmt()
        .json()
        .with_writer(non_blocking)
        .with_env_filter(EnvFilter::from_default_env())
        .init();

    let options = Options::try_parse()?;

    let pool = sqlx::SqlitePool::connect("sqlite:../local.db").await?;

    let root = options.root.clone();
    cache(root, pool, options.into()).await?;

    Ok(())
}
