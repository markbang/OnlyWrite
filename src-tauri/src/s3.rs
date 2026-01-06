use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

const S3_CONFIG_FILE: &str = "s3_config.json";

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct S3Config {
    pub bucket_name: String,
    pub region: String,
    pub access_key_id: String,
    pub secret_access_key: String,
    pub endpoint_url: Option<String>,
    pub path_prefix: Option<String>,
}

impl S3Config {
    fn get_config_path(app: &AppHandle) -> Result<PathBuf, String> {
        let config_dir = app
            .path()
            .app_config_dir()
            .map_err(|e| format!("Failed to get config dir: {}", e))?;
        Ok(config_dir.join(S3_CONFIG_FILE))
    }

    pub fn save(&self, app: &AppHandle) -> Result<(), String> {
        let config_path = Self::get_config_path(app)?;

        if let Some(parent) = config_path.parent() {
            fs::create_dir_all(parent)
                .map_err(|e| format!("Failed to create config directory: {}", e))?;
        }

        let json = serde_json::to_string_pretty(self)
            .map_err(|e| format!("Failed to serialize config: {}", e))?;

        fs::write(&config_path, json)
            .map_err(|e| format!("Failed to write config file: {}", e))?;

        Ok(())
    }

    pub fn load(app: &AppHandle) -> Result<Option<Self>, String> {
        let config_path = Self::get_config_path(app)?;

        if !config_path.exists() {
            return Ok(None);
        }

        let content = fs::read_to_string(&config_path)
            .map_err(|e| format!("Failed to read config file: {}", e))?;

        let config: S3Config = serde_json::from_str(&content)
            .map_err(|e| format!("Failed to parse config file: {}", e))?;

        Ok(Some(config))
    }

    pub fn delete(app: &AppHandle) -> Result<(), String> {
        let config_path = Self::get_config_path(app)?;

        if config_path.exists() {
            fs::remove_file(&config_path)
                .map_err(|e| format!("Failed to delete config file: {}", e))?;
        }

        Ok(())
    }
}

#[tauri::command]
pub async fn save_s3_config(app: AppHandle, config: S3Config) -> Result<(), String> {
    config.save(&app)
}

#[tauri::command]
pub async fn load_s3_config(app: AppHandle) -> Result<Option<S3Config>, String> {
    S3Config::load(&app)
}

#[tauri::command]
pub async fn delete_s3_config(app: AppHandle) -> Result<(), String> {
    S3Config::delete(&app)
}

#[tauri::command]
pub async fn upload_image_to_s3(
    app: AppHandle,
    file_name: String,
    file_data: Vec<u8>,
) -> Result<String, String> {
    let config = S3Config::load(&app)?
        .ok_or("S3 configuration not found. Please configure S3 settings first.")?;

    let config_loader = aws_config::defaults(aws_config::BehaviorVersion::latest())
        .region(aws_sdk_s3::config::Region::new(config.region.clone()))
        .credentials_provider(aws_sdk_s3::config::Credentials::new(
            config.access_key_id,
            config.secret_access_key,
            None,
            None,
            "s3-upload-creds",
        ));

    let sdk_config = if let Some(endpoint) = &config.endpoint_url {
        config_loader.endpoint_url(endpoint).load().await
    } else {
        config_loader.load().await
    };

    let s3_client = aws_sdk_s3::Client::new(&sdk_config);

    let object_key = if let Some(prefix) = &config.path_prefix {
        format!("{}/{}", prefix.trim_end_matches('/'), file_name)
    } else {
        file_name
    };

    s3_client
        .put_object()
        .bucket(&config.bucket_name)
        .key(&object_key)
        .body(aws_sdk_s3::primitives::ByteStream::from(file_data))
        .send()
        .await
        .map_err(|e| format!("Failed to upload to S3: {}", e))?;

    let url = if let Some(endpoint) = &config.endpoint_url {
        format!("{}/{}/{}", endpoint.trim_end_matches('/'), config.bucket_name, object_key)
    } else {
        format!(
            "https://{}.s3.{}.amazonaws.com/{}",
            config.bucket_name, config.region, object_key
        )
    };

    Ok(url)
}
