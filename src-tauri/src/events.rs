use tauri::{App, Manager};

pub fn a_simple_function() {
  println!("I was invoked from JS!");
}

pub fn a_function_with_payload(payload: String) {
  println!("I was invoked from JS, with this payload: {}", payload);
}

pub fn a_function_with_a_result(app: App) -> String {
  let app_dir = app.path_resolver().app_config_dir();
  return app_dir.to_str().unwrap().to_string();
}
