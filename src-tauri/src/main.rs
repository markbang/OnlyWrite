// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod events;

#[tauri::command]
fn scoop_update() -> Result<String, String> {
    let output = std::process::Command::new("cmd")
        .arg("/C")
        .arg("scoop update *")
        .output()
        .expect("Failed to execute scoop update");
    if output.status.success() {
        let stdout = String::from_utf8_lossy(&output.stdout);
        println!("Scoop update output: {}", stdout);
        Ok(stdout.to_string())
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr);
        eprintln!("Scoop update error: {}", stderr);
        Err(stderr.to_string())
    }
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            scoop_update,
            events::a_simple_function,
            events::a_function_with_payload,
            events::a_function_with_a_result
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
