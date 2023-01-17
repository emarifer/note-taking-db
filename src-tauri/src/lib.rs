use rusqlite::{Connection, Result};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Note {
    pub id: String,
    pub title: String,
    pub markdown: String,
    pub tag_ids: String,
    pub timestamp: u64,
}

#[derive(Serialize, Deserialize)]
pub struct Tag {
    pub id: String,
    pub label: String,
}

fn get_connection() -> Result<Connection, Box<dyn std::error::Error>> {
    let mut user_home = String::new();
    if let Some(path) = home::home_dir() {
        if let Some(my_home) = path.join(".notes.sqlite").as_path().to_str() {
            user_home = my_home.to_owned();
        }
    }

    let conn = Connection::open(user_home)?;
    conn.execute(
        "create table if not exists notes (
      id text not null unique,
      title text,
      markdown text,
      tag_ids text,
      timestamp integer
    )",
        [],
    )?;

    conn.execute(
        "create table if not exists tags (
      id text not null unique,
      label text
    )",
        [],
    )?;

    Ok(conn)
}

pub fn insert_record_note(data: Note) -> Result<(), Box<dyn std::error::Error>> {
    let mut conn = get_connection()?;

    let tx = conn.transaction()?;

    tx.execute(
        "INSERT INTO notes (id, title, markdown, tag_ids, timestamp) VALUES (?1, ?2, ?3, ?4, ?5)",
        (
            &data.id,
            &data.title,
            &data.markdown,
            &data.tag_ids,
            &data.timestamp,
        ),
    )?;

    tx.commit()?;

    Ok(())
}

pub fn insert_record_tag(data: Tag) -> Result<(), Box<dyn std::error::Error>> {
    let mut conn = get_connection()?;

    let tx = conn.transaction()?;

    tx.execute(
        "INSERT INTO tags (id, label) VALUES (?1, ?2)",
        (&data.id, &data.label),
    )?;

    tx.commit()?;

    Ok(())
}

pub fn delete_note(id: &str) -> Result<(), Box<dyn std::error::Error>> {
    let conn = get_connection()?;

    let mut stmt = conn.prepare("DELETE FROM notes WHERE id = (?)")?;
    stmt.execute([id])?;

    Ok(())
}

pub fn delete_tag(id: &str) -> Result<(), Box<dyn std::error::Error>> {
    let conn = get_connection()?;

    let mut stmt = conn.prepare("DELETE FROM tags WHERE id = (?)")?;
    stmt.execute([id])?;

    Ok(())
}

pub fn update_note(note: Note) -> Result<(), Box<dyn std::error::Error>> {
    let conn = get_connection()?;

    let mut stmt = conn.prepare(
        "UPDATE notes SET title = (?1), markdown = (?2), tag_ids = (?3) WHERE id = (?4)",
    )?;
    stmt.execute([note.title, note.markdown, note.tag_ids, note.id])?;

    Ok(())
}

pub fn update_tag(tag: Tag) -> Result<(), Box<dyn std::error::Error>> {
    let conn = get_connection()?;

    let mut stmt = conn.prepare("UPDATE tags SET label = (?1) WHERE id = (?2)")?;
    stmt.execute([tag.label, tag.id])?;

    Ok(())
}

pub fn get_all_notes() -> Result<Vec<Note>, Box<dyn std::error::Error>> {
    let conn = get_connection()?;

    let mut stmt = conn.prepare("SELECT * FROM notes")?;

    /* let names = stmt
        .column_names()
        .into_iter()
        .map(|s| String::from(s))
        .collect::<Vec<_>>();
    println!("{:?}", names); */

    let notes_iter = stmt.query_map([], |row| {
        Ok(Note {
            id: row.get("id")?,
            title: row.get("title")?,
            markdown: row.get("markdown")?,
            tag_ids: row.get("tag_ids")?,
            timestamp: row.get("timestamp")?,
        })
    })?;

    let mut notes: Vec<Note> = vec![];

    for note in notes_iter {
        notes.push(note?);
    }

    Ok(notes)
}

pub fn get_all_tags() -> Result<Vec<Tag>, Box<dyn std::error::Error>> {
    let conn = get_connection()?;

    let mut stmt = conn.prepare("SELECT * FROM tags")?;

    let tags_iter = stmt.query_map([], |row| {
        Ok(Tag {
            id: row.get("id")?,
            label: row.get("label")?,
        })
    })?;

    let mut tags: Vec<Tag> = vec![];

    for tag in tags_iter {
        tags.push(tag?);
    }

    Ok(tags)
}
