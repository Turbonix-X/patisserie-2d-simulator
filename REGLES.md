# Règles de Pâtisserie 2D Simulator

Ces règles sont celles de la **Bêta 1.3**.

## Le but

Tu ouvres une pâtisserie avec 50 €. Tu achètes des ingrédients, tu prépares des gâteaux, tu les vends, et tu fais grandir ta boutique jusqu'au niveau 1000. Il n'y a pas de fin obligatoire : tu peux aussi viser tous les succès.

## Une partie, pas à pas

1. **Acheter :** clique sur un ingrédient. Chaque unité se paie, et un achat donne 1 XP.
2. **Préparer :** une recette demande des ingrédients, de l'espace et un four libre.
3. **Vendre :** une pièce vendue rapporte de l'argent et de l'XP.
4. **Grandir :** les niveaux débloquent de nouveaux ingrédients, recettes, bâtiments et employés.

Tu peux acheter par ×1, ×10, ×100 ou Max.

## Les prix

- Plus tu vends le même gâteau, plus son prix baisse, jusqu'à 30 % du prix normal au pire.
- Vendre les autres gâteaux fait remonter un peu son prix, jusqu'à 150 % au mieux.
- La demande revient toute seule avec le temps.
- Chaque succès augmente tous tes prix de vente de 0,1 %.
- Revendre un ingrédient rapporte la moitié de son prix.

## Les fours et l'espace

- Tu commences avec 2 fours. Chaque four prépare une fournée à la fois, et les autres attendent leur tour, 50 au maximum.
- Un four coûte 200 €, puis 4 fois plus à chaque achat, jusqu'à 30 fours. Le bouton est dans la barre du bas.
- Chaque gâteau prend de la place, et une fournée qui ne rentre pas est refusée. Si la place manque à la fin de la cuisson, les ingrédients sont rendus.

## Le loyer et les dettes

- Le loyer coûte 2 € par m² et par heure. Il se prélève tout seul.
- Si tu n'as plus d'argent, le propriétaire attend **3 minutes**. Ce qui n'a pas été payé pendant ce temps est oublié.
- Après ces 3 minutes, une dette commence, avec des intérêts de 0,002 % par seconde.
- La dette se rembourse toute seule dès que tu as de l'argent.
- **À ta première dette**, Bob te donne 50 €, t'ouvre un compte bancaire et t'explique les prêts.

## La banque

L'onglet Banque s'ouvre à ta première dette. Tu ne peux avoir qu'un seul prêt de chaque montant à la fois.

| Prêt | Niveau requis | Intérêts | Durée |
|---|---|---|---|
| 10 € | 1 | 5 % | 2 min |
| 20 € | 1 | 5 % | 3 min |
| 50 € | 1 | 8 % | 5 min |
| 100 € | 3 | 10 % | 5 min |
| 200 € | 5 | 12 % | 8 min |
| 500 € | 10 | 15 % | 10 min |
| 1 000 € | 15 | 18 % | 15 min |
| 5 000 € | 25 | 22 % | 30 min |
| 10 000 € | 40 | 25 % | 45 min |

- Le remboursement est prélevé tout seul, un peu chaque seconde.
- **Rembourser en avance coûte moins cher :** tu ne paies pas les intérêts qui restaient à venir. Juste après l'emprunt, tu rends exactement ce que tu as reçu.
- Sans argent au moment du prélèvement, le prêt est en retard et coûte de plus en plus cher.

## La faillite

Tu fais faillite seulement si tout cela est vrai en même temps :

- tu n'as plus d'argent et tu as une dette ;
- rien ne cuit, et aucun bâtiment ni employé ne produit ;
- revendre tout ton stock ne suffirait pas à payer la dette ;
- la banque ne peut plus rien te prêter.

## Les bâtiments

Les bâtiments s'achètent à partir du **niveau 40**. Chaque bâtiment produit un ingrédient tout seul, et son prix monte de 15 % à chaque achat.

## Les employés

Ils reçoivent un salaire. Un employé impayé perd le moral, peut faire grève, puis démissionne. Un employé payé ne démissionne jamais.

| Employé | Niveau | Ce qu'il fait |
|---|---|---|
| Cueilleur | 5 | Produit l'ingrédient que tu choisis |
| Boulanger | 10 | Ajoute un four et prépare 5 % plus vite |
| Vendeur | 15 | Vend tes gâteaux tout seul, les plus chers d'abord |
| Manager | 25 | Remonte le moral de l'équipe |
| Transporteur | 20, avec 2 pâtisseries | Transporte de l'argent, des gâteaux ou des ingrédients vers une autre pâtisserie |
| Maître d'hôtel | 30 | Livre les commandes des clients à ta place |
| Chef pâtissier | 40 | Prépare 8 % plus vite et fait monter les prix de 5 % |

Sur la carte du Transporteur, tu choisis sa destination et ce qu'il transporte. Il fait un voyage toutes les 20 secondes environ, plus vite s'il est formé et compétent, et seulement pendant que tu joues. Il laisse toujours une minute de salaires et de loyer dans la caisse. Les gâteaux doivent avoir la place en arrivant.

Tu peux recruter tout de suite, ou attendre un candidat, moins cher. Former un employé le rend plus efficace, mais mieux payé. Une prime remonte son moral.

## Les commandes (niveau 30)

- Des clients passent commande, 4 au maximum en même temps. Livre avant la fin du temps. Une commande ratée n'a aucune pénalité.
- Plus la commande demande de gâteaux différents, plus elle rapporte :

| Gâteaux différents | Difficulté | Prix payé | Disponible au niveau |
|---|---|---|---|
| 1 | Simple | ×1,25 | 30 |
| 2 | Moyenne | ×1,6 | 30 |
| 3 | Difficile | ×2,1 | 80 |
| 4 | Extrême | ×2,8 | 150 |

## La boutique de machines (niveau 50)

Des améliorations pour toujours, pour toutes tes pâtisseries, même après un rebirth. Chaque machine a 5 niveaux, et chaque niveau coûte bien plus cher que le précédent.

| Machine | Prix de départ | Bonus par niveau |
|---|---|---|
| Pétrin industriel | 100 000 € | Préparations 5 % plus rapides |
| Isolation du local | 150 000 € | Loyer 8 % moins cher |
| Robot de cuisine | 200 000 € | Ingrédients 3 % moins chers |
| Four à convection | 250 000 € | 2 fours de plus |
| Tapis roulant | 300 000 € | Bâtiments 10 % plus productifs |
| Caisse automatique | 350 000 € | Vendeurs 15 % plus rapides |
| Étiqueteuse de luxe | 400 000 € | Les prix baissent 10 % moins vite |
| Vitrine réfrigérée | 500 000 € | Prix de vente +5 % |
| Guichet des commandes | 600 000 € | Primes des commandes +10 % |
| Académie du goût | 800 000 € | XP +10 % |

## Plusieurs pâtisseries

- La deuxième coûte 10 000 €, puis le prix est multiplié par 3 à chaque nouvelle boutique.
- **Toutes travaillent en même temps :** production, cuissons, vendeurs, loyers, salaires et commandes continuent même quand tu n'y es pas.
- Chaque boutique garde son argent, son stock et son équipe. La dette d'une boutique où tu n'es pas ne prend pas d'intérêts.
- Dès la deuxième boutique, les Statistiques des réglages ajoutent des graphiques et les totaux de toutes tes pâtisseries, dont le gâteau qui rapporte le plus dans chacune.
- Le Transporteur déplace ton argent et ton stock d'une pâtisserie à l'autre (voir Les employés).
- **Vendre une pâtisserie :** tu reçois son argent, la moitié de la valeur de ses gâteaux et de ses ingrédients, la moitié de la valeur de son équipement, 10 % de ce qu'elle a gagné et la moitié de son prix d'achat, moins sa dette. Tu perds toutes ses statistiques. Tes succès restent.
- Renommer une pâtisserie coûte 100 €.

## Le rebirth

Quand tu as le niveau et l'argent demandés, tu peux repartir avec une boutique vide contre un bonus permanent.

| Rebirth | Niveau | Prix | Bonus | Espace |
|---|---|---|---|---|
| Boulangerie | 40 | 5 000 € | +15 % | ×1,1 |
| Pâtisserie Fine | 80 | 50 000 € | +25 % | ×1,25 |
| Maison de Luxe | 120 | 500 000 € | +40 % | ×1,5 |
| Palace Gastronomique | 200 | 5 M€ | +60 % | ×2 |
| Empire de la Pâtisserie | 300 | 50 M€ | +80 % | ×3 |
| Dynastie Sucrée | 500 | 500 M€ | +100 % | ×5 |
| Légende Éternelle | 1000 | 10 Md€ | +200 % | ×10 |

Tu gardes ton argent, ton niveau, tes succès, tes statistiques, tes machines, tes prêts et ta dette. Tu perds ton stock, tes bâtiments, tes employés, tes fours et tes agrandissements.

## Bob

- Bob est ton chef pâtissier. Il t'accueille et t'explique le jeu.
- **Ses conseils :** de lui-même, il te signale dans sa bulle un gâteau qui se vend mal, un stock qui déborde, un loyer trop cher, une commande qui va expirer et un employé qui va faire grève.
- Évite de cliquer sur lui : il s'énerve de plus en plus, puis il devient aigri.
- Bob adore le sucre. Quand il est triste, glisse un sucre sur lui : il coûte 1 sucre et le rend moins triste, sans repasser par la colère. Il faut 4 sucres pour le remettre de bonne humeur.
- **Son défi :** tous les 2 à 5 jours, Bob te propose un défi à réussir en 24 heures. Si tu réussis, il te donne 5 % de tout ton argent, toutes pâtisseries confondues. Tu peux refuser sans pénalité.

## Les événements

Environ toutes les 4 minutes, un événement change le jeu pour un moment : rush, soldes, passage à la télé, grève des fournisseurs, contrôle sanitaire… De petits incidents peuvent aussi te faire perdre un peu d'un ingrédient.

## Les thèmes

| Thème | Disponible |
|---|---|
| Clair, Sombre | Toujours |
| Printemps, Été, Automne, Hiver | Pendant leur saison. Le thème se bloque quand la saison se termine. |
| Anniversaire | Le jour de ton anniversaire, si tu as indiqué ta date |
| Fête | Pour toujours dès le niveau 500 |
| Espace | Pour toujours dès le niveau 1000 |

Tu peux choisir un thème pour tout le jeu, ou seulement pour la pâtisserie où tu es. Dans les thèmes spéciaux, Bob change de tenue.

## L'anniversaire

Indique ta date dans les réglages. Le jour J, tu as le thème spécial et un bonus ×2 pendant 24 heures, une fois par an. Si tu mets la date du jour, le bonus ne compte pas ce jour-là. Corriger ta date coûte 50 €.

## Les succès

Il y a 1000 succès, plus 5 secrets. Ils se trouvent dans les réglages, avec les statistiques. Un succès pas encore obtenu ne dit pas ce qu'il demande, et un secret reste invisible tant que tu ne l'as pas trouvé. Les totaux de toutes tes pâtisseries comptent aussi pour les débloquer.

## Clavier

Échap met le jeu en pause, ou ferme la fenêtre ouverte. Les chiffres ouvrent les onglets.

## Absence et sauvegarde

- Le jeu se sauvegarde tout seul toutes les 30 secondes, dans ton navigateur.
- Quand tu reviens, tes boutiques ont travaillé pendant 5 heures au maximum : production, ventes des vendeurs, loyers, salaires et prêts. Pendant ton absence, aucune dette n'est créée.
- Tu peux exporter ta partie sous forme de code, et l'importer ailleurs.

## Trop de clics

Plus de 15 clics par seconde déclenchent une pause de 3 secondes. Après 3 pauses, une petite addition vérifie que tu n'es pas un robot. Après 3 mauvaises réponses, tu es bloqué pendant 5 minutes.

## La console

Une console de commandes se cache dans le jeu. Il te faudra embêter Bob pour la trouver, et elle demande un code. Ses commandes sont expliquées dans son guide intégré.

## Langues

Le jeu existe en français, en anglais et en espagnol. Il choisit la langue de ton navigateur au départ, et tu peux la changer dans les réglages.
