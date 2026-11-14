/* ============================================
   PATISSERIE 2D SIMULATOR - CONFIGURATION
   Les cles Supabase sont publiques par conception (la cle "anon") :
   c'est la securite de la base (RLS) qui protege les donnees.
   Tant que SUPABASE_URL est vide, les comptes en ligne sont desactives
   et le jeu marche normalement avec les sauvegardes locales.
   ============================================ */

var P2DS_CONFIG = {
  SUPABASE_URL: 'https://ghvqtxghqwprzsiwkhja.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_EOHxQRorik_BOEAlHcNHkw_1-3hzWeH',
  // Le lien qui telecharge l'installeur Windows (publie avec chaque Release GitHub)
  DOWNLOAD_URL: 'https://github.com/Turbonix-X/patisserie-2d-simulator/releases/latest/download/Installer-P2DS.exe',
  MAX_INSTANCES: 10
};
