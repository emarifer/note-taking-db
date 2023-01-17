#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use note_taking_db::{
    delete_note, delete_tag, get_all_notes, get_all_tags, insert_record_note, insert_record_tag,
    update_note, update_tag, Note, Tag,
};

#[tauri::command]
fn get_notes() -> Result<Vec<Note>, String> {
    match get_all_notes() {
        Ok(notes) => Ok(notes),
        Err(why) => Err(format!("An error has occurred: {}", why)),
    }
}

#[tauri::command]
fn get_tags() -> Result<Vec<Tag>, String> {
    match get_all_tags() {
        Ok(tags) => Ok(tags),
        Err(why) => Err(format!("An error has occurred: {}", why)),
    }
}

#[tauri::command]
fn insert_note(data: Note) -> Result<(), String> {
    match insert_record_note(data) {
        Ok(_) => Ok(()),
        Err(why) => Err(format!("An error has occurred: {}", why)),
    }
}

#[tauri::command]
fn insert_tag(data: Tag) -> Result<(), String> {
    match insert_record_tag(data) {
        Ok(_) => Ok(()),
        Err(why) => Err(format!("An error has occurred: {}", why)),
    }
}

#[tauri::command]
fn delete_note_by_id(id: &str) -> Result<(), String> {
    match delete_note(id) {
        Ok(_) => Ok(()),
        Err(why) => Err(format!("An error has occurred: {}", why)),
    }
}

#[tauri::command]
fn delete_tag_by_id(id: &str) -> Result<(), String> {
    match delete_tag(id) {
        Ok(_) => Ok(()),
        Err(why) => Err(format!("An error has occurred: {}", why)),
    }
}

#[tauri::command]
fn update_note_by_id(note: Note) -> Result<(), String> {
    match update_note(note) {
        Ok(_) => Ok(()),
        Err(why) => Err(format!("An error has occurred: {}", why)),
    }
}

#[tauri::command]
fn update_tag_by_id(tag: Tag) -> Result<(), String> {
    match update_tag(tag) {
        Ok(_) => Ok(()),
        Err(why) => Err(format!("An error has occurred: {}", why)),
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_notes,
            get_tags,
            insert_note,
            insert_tag,
            delete_note_by_id,
            delete_tag_by_id,
            update_note_by_id,
            update_tag_by_id
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
