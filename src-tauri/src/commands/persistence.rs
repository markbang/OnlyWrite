use std::collections::HashMap;

#[tauri::command]
pub fn get_settings() -> Result<HashMap<String, serde_json::Value>, String> {
    let settings_store = crate::settings::get_settings_store();
    settings_store.load()
        .map_err(|e| format!("Failed to load settings: {}", e))
}

#[tauri::command]
pub fn save_settings(settings: HashMap<String, serde_json::Value>) -> Result<(), String> {
    let mut settings_store = crate::settings::get_settings_store();
    settings_store.set(settings_store)
        .map_err(|e| format!("Failed to save settings: {}", e))?;
    settings_store.save()
        .map_err(|e| format!("Failed to save settings: {}", e))
}

#[tauri::command]
pub fn get_workspace_state() -> Result<WorkspaceData, String> {
    let workspace_store = crate::workspace::get_workspace_store();
    workspace_store.load()
        .map_err(|e| format!("Failed to load workspace state: {}", e))
}

#[tauri::command]
pub fn save_workspace_state(state: WorkspaceData) -> Result<(), String> {
    let mut workspace_store = crate::workspace::get_workspace_store();
    workspace_store.set_state(state)
        .map_err(|e| format!("Failed to set workspace state: {}", e))?;
    workspace_store.save()
        .map_err(|e| format!("Failed to save workspace state: {}", e))
}

#[tauri::command]
pub fn add_recent_file(file: RecentFile) -> Result<(), String> {
    let mut workspace_store = crate::workspace::get_workspace_store();
    workspace_store.add_recent_file(file)
        .map_err(|e| format!("Failed to add recent file: {}", e))?;
    workspace_store.save()
        .map_err(|e| format!("Failed to save workspace state: {}", e))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_settings_commands() {
        let mut settings = HashMap::new();
        settings.insert("theme".to_string(), serde_json::Value::String("system".to_string()));
        settings.insert("fontSize".to_string(), serde_json::Value::Number(16));

        let result = crate::commands::save_settings(settings.clone());
        assert!(result.is_ok(), "save_settings should succeed");

        let loaded = crate::commands::get_settings().unwrap();
        assert_eq!(loaded.get("theme"), Some(&serde_json::Value::String("system".to_string())));
        assert_eq!(loaded.get("fontSize"), Some(&serde_json::Value::Number(16)));
    }
}
