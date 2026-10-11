//! Local storage without a database.
//!
//! Books are whole files written once. User state is an append-only JSON Lines
//! log, which can later be merged across devices.

use serde::{de::DeserializeOwned, Serialize};
use std::fs::{self, File, OpenOptions};
use std::io::{self, BufRead, BufReader, Write};
use std::path::{Path, PathBuf};

/// An append-only log of events, one JSON object per line.
pub struct EventLog {
    path: PathBuf,
}

impl EventLog {
    pub fn new(path: impl Into<PathBuf>) -> Self {
        Self { path: path.into() }
    }

    pub fn append<T: Serialize>(&self, event: &T) -> io::Result<()> {
        let mut line = serde_json::to_vec(event).map_err(io::Error::other)?;
        line.push(b'\n');
        let mut file = OpenOptions::new()
            .create(true)
            .append(true)
            .open(&self.path)?;
        file.write_all(&line)?;
        file.sync_data()
    }

    /// Reads every event in write order. A missing log reads as empty.
    pub fn read_all<T: DeserializeOwned>(&self) -> io::Result<Vec<T>> {
        let file = match File::open(&self.path) {
            Ok(file) => file,
            Err(err) if err.kind() == io::ErrorKind::NotFound => return Ok(Vec::new()),
            Err(err) => return Err(err),
        };
        let mut events = Vec::new();
        for line in BufReader::new(file).lines() {
            let line = line?;
            if line.trim().is_empty() {
                continue;
            }
            events.push(serde_json::from_str(&line).map_err(io::Error::other)?);
        }
        Ok(events)
    }
}

/// Replaces a file so readers never see a half-written version: write a temp
/// file beside it, sync it, then rename it over the target.
pub fn write_atomic(path: &Path, bytes: &[u8]) -> io::Result<()> {
    let tmp = path.with_extension("tmp");
    {
        let mut file = File::create(&tmp)?;
        file.write_all(bytes)?;
        file.sync_all()?;
    }
    fs::rename(&tmp, path)
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde::{Deserialize, Serialize};

    #[derive(Debug, Serialize, Deserialize, PartialEq)]
    struct Review {
        card: String,
        rating: u8,
    }

    #[test]
    fn event_log_reads_back_in_write_order() {
        let dir = tempfile::tempdir().unwrap();
        let log = EventLog::new(dir.path().join("reviews.jsonl"));
        let first = Review { card: "fueron".into(), rating: 3 };
        let second = Review { card: "erano".into(), rating: 1 };
        log.append(&first).unwrap();
        log.append(&second).unwrap();
        assert_eq!(log.read_all::<Review>().unwrap(), vec![first, second]);
    }

    #[test]
    fn missing_log_reads_as_empty() {
        let dir = tempfile::tempdir().unwrap();
        let log = EventLog::new(dir.path().join("none.jsonl"));
        assert!(log.read_all::<Review>().unwrap().is_empty());
    }

    #[test]
    fn write_atomic_replaces_existing_file() {
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("book.json");
        write_atomic(&path, b"one").unwrap();
        write_atomic(&path, b"two").unwrap();
        assert_eq!(fs::read(&path).unwrap(), b"two");
    }
}
