// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use std::io::Write;
use std::path::{Path, PathBuf};
use tauri::Manager;
use base64::{Engine as _, engine::general_purpose};
use uuid::Uuid;

#[derive(serde::Serialize, Clone)]
struct FileNode {
    name: String,
    path: String,
    children: Option<Vec<FileNode>>,
}

fn read_dir_recursive<P: AsRef<Path>>(path: P) -> Result<Vec<FileNode>, std::io::Error> {
    let mut entries = vec![];
    for entry in fs::read_dir(path)? {
        let entry = entry?;
        let path = entry.path();
        let name = entry.file_name().to_string_lossy().to_string();

        if path.is_dir() {
            entries.push(FileNode {
                name,
                path: path.to_string_lossy().to_string(),
                children: Some(read_dir_recursive(&path)?),
            });
        } else {
            entries.push(FileNode {
                name,
                path: path.to_string_lossy().to_string(),
                children: None,
            });
        }
    }
    Ok(entries)
}

#[derive(serde::Serialize)]
struct OpenFolderResult {
    root_path: String,
    tree: Vec<FileNode>,
}

#[tauri::command]
fn open_folder(app: tauri::AppHandle) -> Result<OpenFolderResult, String> {
    let dialog = tauri_plugin_dialog::Dialog::new(app);
    let picked_folder = dialog.file().blocking().pick_folder();

    if let Some(folder_path) = picked_folder {
        let path_str = folder_path.to_string();
        let tree = read_dir_recursive(&path_str).map_err(|e| e.to_string())?;
        Ok(OpenFolderResult {
            root_path: path_str,
            tree,
        })
    } else {
        Err("No folder was selected.".into())
    }
}

#[tauri::command]
fn save_image(base64_image: String, folder_path: String) -> Result<String, String> {
    let assets_dir = Path::new(&folder_path).join("assets");
    fs::create_dir_all(&assets_dir).map_err(|e| e.to_string())?;

    let (image_type, encoded_data) = base64_image.split_once(",").ok_or("Invalid base64 format")?;
    let extension = image_type.split("/").nth(1).and_then(|s| s.split(";").next()).unwrap_or("png");

    let decoded_data = general_purpose::STANDARD.decode(encoded_data).map_err(|e| e.to_string())?;

    let filename = format!("{}.{}", Uuid::new_v4(), extension);
    let file_path = assets_dir.join(&filename);

    let mut file = fs::File::create(&file_path).map_err(|e| e.to_string())?;
    file.write_all(&decoded_data).map_err(|e| e.to_string())?;

    Ok(format!("assets/{}", filename))
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![open_folder, save_image])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
