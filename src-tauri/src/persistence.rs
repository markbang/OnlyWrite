use std::collections::HashMap;

use serde_json::Value;
use tauri::AppHandle;
use tauri_plugin_store::StoreExt;

#[tauri::command]
pub fn get_settings(app: AppHandle) -> Result<HashMap<String, Value>, String> {
    let store = app
        .store("settings.json")
        .map_err(|e| format!("Failed to open settings store: {e}"))?;

    let mut settings = HashMap::new();
    for (key, value) in store.entries() {
        settings.insert(key.to_string(), value.clone());
    }

    Ok(settings)
}

#[tauri::command]
pub fn save_settings(app: AppHandle, settings: HashMap<String, Value>) -> Result<(), String> {
    let store = app
        .store("settings.json")
        .map_err(|e| format!("Failed to open settings store: {e}"))?;

    for (key, value) in settings {
        store.set(key, value);
    }

    store
        .save()
        .map_err(|e| format!("Failed to save settings store: {e}"))
}
