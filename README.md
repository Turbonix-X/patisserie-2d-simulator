# Pâtisserie 2D Simulator

**A NOTER:** Ce site est fait à 100% par Intelligence Artificielle (ou Super Intelligence pour les intimes).

Un jeu de gestion de pâtisserie : achète tes ingrédients, prépare tes gâteaux, vends-les, et fais grandir ta boutique.

**Jouer en ligne : https://turbonix-x.github.io/patisserie-2d-simulator/**

**Le wiki du jeu, pour tout comprendre : [REGLES.md](REGLES.md)**

**Tout ce qui a changé à chaque mise à jour : [CHANGELOG.md](CHANGELOG.md)**

**À savoir :** les recettes du jeu sont fausses. Elles servent juste à donner un parcours au jeu : ne les cuisine pas chez toi.

Ça marche sur ordi, tablette et téléphone, il n'y a rien à installer, et une fois chargé le jeu marche aussi sans connexion.

## Ce qu'on peut faire

- **Ingrédients :** 47 ingrédients à acheter, revendre et parfois fabriquer.
- **Recettes :** 60 pâtisseries à débloquer et à préparer, du cookie au gâteau infini.
- **Ventes :** les prix bougent selon ce que tu vends, et la demande revient avec le temps.
- **Bâtiments :** au niveau 40, 59 bâtiments qui livrent une énorme quantité d'ingrédients une fois par heure.
- **Employés :** cueilleurs, boulangers, vendeurs, managers, chefs pâtissiers, maîtres d'hôtel, transporteurs, intendants, touche-à-tout et apprentis, sur 10 niveaux, avec leur moral et leur salaire réglable.
- **Espace et loyer :** agrandis ta boutique, mais gare aux dettes.
- **Banque :** à ta première dette, Bob t'ouvre un compte et t'explique les prêts, de 10 € à 10 000 €.
- **Commandes :** au niveau 30, des clients passent commande. Plus c'est compliqué, plus la prime est grosse.
- **Machines :** four, fouet, pétrin… des améliorations permanentes, propres à chaque pâtisserie.
- **Événements :** rush, soldes, passage à la télé, contrôle sanitaire…
- **Succès et statistiques :** 1000 succès à débloquer. Chacun augmente tes prix de vente. Les statistiques détaillent chaque recette et chaque ingrédient préparés dans un menu déroulant.
- **Plusieurs pâtisseries :** dès la deuxième, des graphiques et les totaux de toutes tes boutiques.
- **Thèmes :** clair, sombre, un par saison avec ses décors (fleurs, plage, neige, feuilles), un pour ton anniversaire, la fête au niveau 500, l'espace au niveau 1000, et des thèmes cachés à découvrir.
- **Langues :** anglais, français, espagnol, portugais, allemand, arabe, mandarin, japonais, coréen et russe.
- **Musique :** des morceaux composés pour le jeu, joués en direct par le navigateur, dont certains à débloquer en montant de niveau.
- **Bob :** ton chef pâtissier t'explique le jeu, te conseille, te lance des défis et adore le sucre. Évite de trop l'embêter.
- **Sauvegarde :** automatique, avec export et import par fichier ou par copier-coller, une pause automatique, des mises à jour sans recharger la page, et des gains pendant ton absence.

## Appli Windows (Tauri)

L'appli embarque le jeu et marche sans internet. Les fichiers sont dans `src-tauri/` (Rust) ; `web/` est une copie du jeu refaite à chaque compilation par `tools/sync_web.py`.

- **Compiler :** `python tools/sync_web.py`, puis `cargo tauri build` (avec `TAURI_SIGNING_PRIVATE_KEY` qui pointe vers la clé de signature). L'installeur est `src-tauri/target/release/bundle/nsis/*-setup.exe`.
- **Publier une version :** pousse une étiquette (`git tag v1.2.1 && git push --tags`) et le workflow `tools/release-workflow.yml` (à copier dans `.github/workflows/release.yml` : GitHub exige un droit en plus pour le pousser depuis un terminal) compile, signe et publie `Installer-P2DS.exe` et `latest.json` sur la Release. Ou, depuis ce PC : `update-app.bat 1.2.1`.
- **Mises à jour :** au lancement, avec internet, l'appli vérifie `latest.json` sur la dernière Release et propose d'installer. Sans internet, elle démarre sans rien dire.
- **Installeur :** trois pages avec Bob (langue, sauvegardes, compte) ; le résultat est écrit dans `%APPDATA%\com.turbonix.p2ds\init_config.json`.

## Comptes en ligne (Supabase)

1. Crée un projet gratuit sur supabase.com, puis colle `supabase_setup.sql` dans *SQL Editor* (après avoir remplacé `ADMIN_EMAIL` par ton adresse).
2. Remplis `SUPABASE_URL` et `SUPABASE_ANON_KEY` dans `JS/Config.js` (la clé « anon » est publique par conception).
3. Pour Google : *Authentication > Providers > Google*, avec ton identifiant et ton secret OAuth, et ajoute l'adresse du jeu dans *URL Configuration*.
4. Pour la base de données en direct des joueurs, relance tout `supabase_setup.sql` après chaque mise à jour du fichier (il est fait pour pouvoir être relancé sans risque). Dans *Authentication > Providers > Email*, désactive *Confirm email* pour que l'inscription soit immédiate.
5. `admin.html` ne montre rien tant que tu n'es pas connecté avec le compte administrateur. On y accède avec le bouton « Panneau admin » de la fenêtre des comptes (visible seulement pour l'administrateur) ou directement à l'adresse `…/admin.html`.

## Lancer le jeu sur ton ordi

Ouvre `index.html` dans ton navigateur, ou lance un petit serveur dans le dossier :

```bash
python -m http.server 8090
```

Le jeu est alors sur http://localhost:8090.

## Vérifier le jeu

Le serveur lancé, ouvre http://localhost:8090/tests/ : la page vérifie l'économie et les données du jeu (recettes rentables, ordre de déblocage, argent infini...).

## Crédits

- Police : [Outfit](https://fonts.google.com/specimen/Outfit). Bob vient des sites Turbonix.
- Icônes : [Twemoji](https://github.com/jdecked/twemoji), sous licence [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/), plus quelques dessins maison dans `assets/icons/custom`.

Turbonix Entertainment. Tous droits réservés.
