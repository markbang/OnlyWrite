use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkspaceData {
    pub folder_path: Option<String>,
    pub selected_file_path: Option<String>,
    pub recent_files: Vec<RecentFile>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RecentFile {
    pub path: String,
    pub name: String,
    pub accessed_at: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SettingsData {
    pub theme: String,
    pub locale: String,
    pub font_size: u32,
    pub line_height: f32,
    pub tab_width: u32,
    pub show_line_numbers: bool,
    pub word_wrap: bool,
    pub spell_check: bool,
    pub autosave_enabled: bool,
    pub autosave_interval: u32,
    pub shortcuts: Shortcuts,
    pub remember_window_size: bool,
    pub show_minimap: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Shortcuts {
    pub save: String,
    pub new_file: String,
    pub open_file: String,
    pub toggle_sidebar: String,
    pub toggle_command_palette: String,
}

impl Default for SettingsData {
    fn default() -> Self {
        Self {
            theme: "system".to_string(),
            locale: "en".to_string(),
            font_size: 16,
            line_height: 1.6,
            tab_width: 4,
            show_line_numbers: false,
            word_wrap: true,
            spell_check: false,
            autosave_enabled: true,
            autosave_interval: 5,
            shortcuts: Shortcuts {
                save: "mod+s".to_string(),
                new_file: "mod+n".to_string(),
                open_file: "mod+o".to_string(),
                toggle_sidebar: "mod+b".to_string(),
                toggle_command_palette: "mod+shift+p".to_string(),
            },
            remember_window_size: true,
            show_minimap: false,
        }
    }
}

impl Default for WorkspaceData {
    fn default() -> Self {
        Self {
            folder_path: None,
            selected_file_path: None,
            recent_files: Vec::new(),
        }
    }
}
