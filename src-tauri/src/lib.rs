use std::fs;
use tauri::Manager;
use tauri_plugin_dialog::{DialogExt, MessageDialogButtons};
use tauri_plugin_opener::OpenerExt;
use tauri_plugin_updater::UpdaterExt;

/// Ce que l'installeur a noté : la langue, le compte, et le fichier de sauvegarde à importer.
/// Il est dans `$APPDATA/<identifiant de l'appli>/init_config.json`.
#[tauri::command]
fn get_init_config(app: tauri::AppHandle) -> Option<serde_json::Value> {
    let dir = app.path().app_data_dir().ok()?;
    let raw = fs::read_to_string(dir.join("init_config.json")).ok()?;
    let mut cfg: serde_json::Value = serde_json::from_str(raw.trim_start_matches('\u{feff}')).ok()?;
    // Si le joueur a choisi un fichier de sauvegarde, on en donne le contenu au jeu
    let path = cfg.get("save_file").and_then(|v| v.as_str()).unwrap_or("").to_string();
    if !path.is_empty() {
        if let Ok(text) = fs::read_to_string(&path) {
            cfg["save_text"] = serde_json::Value::String(text);
        }
    }
    Some(cfg)
}

/// Ouvre un lien dans le navigateur du joueur (par exemple l'inscription sur le site).
/// Seuls les liens web sont acceptes.
#[tauri::command]
fn open_external(app: tauri::AppHandle, url: String) -> Result<(), String> {
    if !(url.starts_with("https://") || url.starts_with("http://")) {
        return Err("lien refusé".into());
    }
    app.opener().open_url(url, None::<&str>).map_err(|e| e.to_string())
}

/// Au lancement : si internet est là, on regarde sans bruit s'il existe une mise à jour.
/// Sans internet, rien ne s'affiche et le jeu démarre tout de suite. Les sauvegardes sont dans le
/// stockage du navigateur intégré, que la mise à jour ne touche jamais.
async fn check_for_update(app: tauri::AppHandle) {
    let updater = match app.updater() {
        Ok(u) => u,
        Err(_) => return,
    };
    let update = match updater.check().await {
        Ok(Some(u)) => u,
        _ => return, // pas de mise à jour, ou pas de connexion : on ne dit rien
    };
    let ask = app
        .dialog()
        .message(format!(
            "La version {} de Pâtisserie 2D Simulator est disponible.\n\nTes sauvegardes ne seront pas touchées.",
            update.version
        ))
        .title("Mise à jour disponible")
        .buttons(MessageDialogButtons::OkCancelCustom("Installer".into(), "Plus tard".into()));
    let yes = tauri::async_runtime::spawn_blocking(move || ask.blocking_show())
        .await
        .unwrap_or(false);
    if yes {
        if update.download_and_install(|_, _| {}, || {}).await.is_ok() {
            app.restart();
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .invoke_handler(tauri::generate_handler![get_init_config, open_external])
        .setup(|app| {
            // Un jeu : pas de barre de menu
            if let Some(win) = app.get_webview_window("main") {
                let _ = win.remove_menu();
            }
            let handle = app.handle().clone();
            tauri::async_runtime::spawn(async move { check_for_update(handle).await });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("erreur au lancement de P2DS");
}
