use serde_json::Value;
use tauri::AppHandle;
use tauri_plugin_store::StoreExt;

use crate::types::RecentFile;

#[tauri::command]
pub fn get_current_folder_path(app: AppHandle) -> Result<Option<String>, String> {
    let store = app
        .store("workspace.json")
        .map_err(|e| format!("Failed to open workspace store: {e}"))?;

    Ok(store
        .get("folderPath")
        .and_then(|value| value.as_str().map(|path| path.to_string())))
}

#[tauri::command]
pub fn set_current_folder_path(app: AppHandle, path: String) -> Result<(), String> {
    let store = app
        .store("workspace.json")
        .map_err(|e| format!("Failed to open workspace store: {e}"))?;

    store.set("folderPath", Value::String(path));
    store
        .save()
        .map_err(|e| format!("Failed to save workspace store: {e}"))
}

#[tauri::command]
pub fn get_current_file_path(app: AppHandle) -> Result<Option<String>, String> {
    let store = app
        .store("workspace.json")
        .map_err(|e| format!("Failed to open workspace store: {e}"))?;

    Ok(store
        .get("selectedFilePath")
        .and_then(|value| value.as_str().map(|path| path.to_string())))
}

#[tauri::command]
pub fn set_current_file_path(app: AppHandle, path: String) -> Result<(), String> {
    let store = app
        .store("workspace.json")
        .map_err(|e| format!("Failed to open workspace store: {e}"))?;

    store.set("selectedFilePath", Value::String(path));
    store
        .save()
        .map_err(|e| format!("Failed to save workspace store: {e}"))
}

#[tauri::command]
pub fn get_recent_files(app: AppHandle) -> Result<Vec<RecentFile>, String> {
    let store = app
        .store("workspace.json")
        .map_err(|e| format!("Failed to open workspace store: {e}"))?;

    let recent_files = store
        .get("recentFiles")
        .and_then(|value| serde_json::from_value::<Vec<RecentFile>>(value.clone()).ok())
        .unwrap_or_default();

    Ok(recent_files)
}

#[tauri::command]
pub fn add_recent_file(app: AppHandle, file: RecentFile) -> Result<(), String> {
    let store = app
        .store("workspace.json")
        .map_err(|e| format!("Failed to open workspace store: {e}"))?;

    let mut recent_files: Vec<RecentFile> = store
        .get("recentFiles")
        .and_then(|value| serde_json::from_value::<Vec<RecentFile>>(value.clone()).ok())
        .unwrap_or_default();

    recent_files.retain(|entry| entry.path != file.path);
    recent_files.insert(0, file);
    recent_files.truncate(10);

    let serialized = serde_json::to_value(&recent_files)
        .map_err(|e| format!("Failed to serialize recent files: {e}"))?;

    store.set("recentFiles", serialized);
    store
        .save()
        .map_err(|e| format!("Failed to save workspace store: {e}"))
}
