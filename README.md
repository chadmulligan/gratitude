# Coeurs de la paroisse

Mur interactif de coeurs pour le jubilé des 50 ans de la paroisse catholique de Berne et environs. Chaque coeur porte un message de remerciement que l'on découvre en cliquant dessus.

## Fonctionnalités

- **Coeurs SVG** disposés en grille, avec couleurs et rotations aléatoires (un coeur par message)
- **Flip** : cliquer sur un coeur le retourne pour révéler son message
- **Zoom** : mode zoom pour agrandir le message d'un coeur
- **Au hasard** : un bouton sélectionne et ouvre un coeur au hasard
- **Responsive** : adapté mobile, tablette et desktop

## Structure

```
index.html       Page principale
styles.css       Feuille de styles
script.js        Logique d'interaction
messages.csv     Messages affichés dans les coeurs (exemples fournis, à remplacer)
tests.html       Tests automatisés (navigateur)
.githooks/       Hooks git partagés
```

## Lancer le projet

Le projet est 100 % statique — il suffit d'un serveur HTTP local :

```sh
python3 -m http.server 8000
```

Puis ouvrir http://localhost:8000.

## Tests

Ouvrir `tests.html` dans un navigateur, ou laisser le hook pre-push les exécuter automatiquement avant chaque push.

## Configuration git

Après avoir cloné le dépôt, activer les hooks partagés :

```sh
git config core.hooksPath .githooks
```

Cela active le hook `pre-push` qui lance les tests dans Chrome headless avant chaque push. Prérequis : Chrome (ou Chromium) et `python3`.
