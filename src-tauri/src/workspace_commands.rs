use crate::stores::get_workspace_store;
use crate::types::{WorkspaceData};

#[tauri::command]
pub fn get_current_folder_path() -> Result<Option<String>, String> {
    let workspace_store = get_workspace_store();
    let state = workspace_store.get(|_| WorkspaceData::default()).unwrap();
    Ok(state.folder_path)
}

#[tauri::command]
pub fn set_current_folder_path(path: String) -> Result<(), String> {
    let mut workspace_store = get_workspace_store();
    let mut state = workspace_store.get(|_| WorkspaceData::default()).unwrap();
    state.folder_path = Some(path);
    workspace_store.set_state(state)
        .map_err(|e| format!("Failed to set folder path: {}", e))?;
    workspace_store.save()
        .map_err(|e| format!("Failed to save workspace state: {}", e))
}

#[tauri::command]
pub fn get_current_file_path() -> Result<Option<String>, String> {
    let workspace_store = get_workspace_store();
    let state = workspace_store.get(|_| WorkspaceData::default()).unwrap();
    Ok(state.selected_file_path)
}

#[tauri::command]
pub fn set_current_file_path(path: String) -> Result<(), String> {
    let mut workspace_store = get_workspace_store();
    let mut state = workspace_store.get(|_| WorkspaceData::default()).unwrap();
    state.selected_file_path = Some(path);
    workspace_store.set_state(state)
        .map_err(|e| format!("Failed to set file path: {}", e))?;
    workspace_store.save()
        .map_err(|e| format!("Failed to save workspace state: {}", e))
}

#[tauri::command]
pub fn get_recent_files() -> Result<Vec<RecentFile>, String> {
    let workspace_store = get_workspace_store();
    let state = workspace_store.get(|_| WorkspaceData::default()).unwrap();
    Ok(state.recent_files)
}
