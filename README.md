# Pâtisserie 2D Simulator

**A NOTER:** Ce site est fait à 100% par Intelligence Artifficielle (ou Super Intelligence pour les intimes).

Un jeu de gestion de pâtisserie : achète tes ingrédients, prépare tes gâteaux, vends-les, et fais grandir ta boutique.

**Jouer en ligne : https://turbonix-x.github.io/patisserie-2d-simulator/**

**Toutes les règles : [REGLES.md](REGLES.md)**

Ça marche sur ordi, tablette et téléphone, et il n'y a rien à installer.

## Ce qu'on peut faire

- **Ingrédients :** 47 ingrédients à acheter, revendre et parfois fabriquer.
- **Recettes :** 60 pâtisseries à préparer, du cookie au gâteau infini.
- **Ventes :** les prix bougent selon ce que tu vends, et la demande revient avec le temps.
- **Bâtiments :** 59 bâtiments qui produisent des ingrédients tout seuls, et des fours à ajouter.
- **Employés :** cueilleurs, boulangers, vendeurs, managers, chefs, maîtres d'hôtel et transporteurs, avec leur moral et leur salaire.
- **Espace et loyer :** agrandis ta boutique, mais gare aux dettes.
- **Banque :** à ta première dette, Bob t'ouvre un compte et t'explique les prêts, de 10 € à 10 000 €.
- **Commandes :** au niveau 30, des clients passent commande. Plus c'est compliqué, plus la prime est grosse.
- **Machines :** au niveau 50, des améliorations pour toujours, à prix élevé.
- **Rebirth :** ouvre une nouvelle pâtisserie pour gagner des bonus permanents.
- **Événements :** rush, soldes, passage à la télé, contrôle sanitaire…
- **Succès et statistiques :** des centaines de succès, dont 5 secrets. Chacun augmente tes prix de vente.
- **Plusieurs pâtisseries :** dès la deuxième, des graphiques et les totaux de toutes tes boutiques.
- **Thèmes :** clair, sombre, un par saison avec ses décors (fleurs, plage, neige, feuilles), un pour ton anniversaire, la fête au niveau 500 et l'espace au niveau 1000.
- **Musique :** des morceaux composés pour le jeu, joués en direct par le navigateur.
- **Bob :** ton chef pâtissier t'explique le jeu, te conseille, te lance des défis et adore le sucre. Évite de trop l'embêter.
- **Sauvegarde :** automatique, avec export et import d'un code, et gains pendant ton absence.

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
