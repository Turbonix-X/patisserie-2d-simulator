use std::fs;
use tauri::Manager;
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

/// Le nom du jeu (« Release 1.2.2 ») est dans les notes de latest.json ; le numéro x.y.z de Tauri n'est qu'interne.
fn update_name(update: &tauri_plugin_updater::Update) -> String {
    update
        .body
        .clone()
        .filter(|b| !b.trim().is_empty())
        .unwrap_or_else(|| update.version.clone())
}

/// Le jeu demande, sans bruit, s'il existe une mise à jour. Renvoie son nom, ou rien (pas de mise à jour, ou pas de connexion).
#[tauri::command]
async fn check_update(app: tauri::AppHandle) -> Option<String> {
    let updater = app.updater().ok()?;
    match updater.check().await {
        Ok(Some(u)) => Some(update_name(&u)),
        _ => None,
    }
}

/// Le joueur a cliqué sur « Mettre à jour » : on télécharge, on installe, puis l'appli se relance toute seule.
/// Les sauvegardes sont dans le stockage du navigateur intégré, que la mise à jour ne touche jamais.
#[tauri::command]
async fn install_update(app: tauri::AppHandle) -> Result<(), String> {
    let updater = app.updater().map_err(|e| e.to_string())?;
    let update = updater
        .check()
        .await
        .map_err(|e| e.to_string())?
        .ok_or_else(|| "aucune mise à jour".to_string())?;
    update
        .download_and_install(|_, _| {}, || {})
        .await
        .map_err(|e| e.to_string())?;
    app.restart();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .invoke_handler(tauri::generate_handler![get_init_config, open_external, check_update, install_update])
        .setup(|app| {
            // Un jeu : pas de barre de menu
            if let Some(win) = app.get_webview_window("main") {
                let _ = win.remove_menu();
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("erreur au lancement de P2DS");
}
