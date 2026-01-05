use tauri::{AppHandle, Manager};

#[tauri::command]
pub fn a_simple_function() {
  println!("I was invoked from JS!");
}

#[tauri::command]
pub fn a_function_with_payload(payload: String) {
  println!("I was invoked from JS, with this payload: {}", payload);
}

#[tauri::command]
pub fn a_function_with_a_result(app: AppHandle) -> String {
  match app.path().app_config_dir() {
    Ok(app_dir) => app_dir.to_string_lossy().to_string(),
    Err(_) => "Unable to get app config directory".to_string(),
  }
}
