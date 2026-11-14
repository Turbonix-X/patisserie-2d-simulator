// Pas de fenêtre de console derrière le jeu sous Windows
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    p2ds_lib::run()
}
