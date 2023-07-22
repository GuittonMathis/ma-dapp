# ArtTRUST DApp

ArtTRUST est une plateforme décentralisée de galerie d'art basée sur la blockchain Ethereum. Cette plateforme permet aux utilisateurs de créer, vendre et acheter des œuvres d'art numériques de manière sécurisée et transparente.

## Fonctionnalités

- **Créer une œuvre d'art** : Les utilisateurs peuvent créer des œuvres d'art numériques en fournissant les détails de l'œuvre et en l'associant à un fichier image.
- **Vendre une œuvre d'art** : Les utilisateurs peuvent mettre en vente les œuvres d'art qu'ils possèdent en fixant un prix en Ether.
- **Acheter une œuvre d'art** : Les utilisateurs peuvent acheter des œuvres d'art mises en vente sur la plateforme. Les transactions sont effectuées en Ether.
- **Parcourir la galerie d'art** : Les utilisateurs peuvent parcourir toutes les œuvres d'art actuellement en vente sur la plateforme.

## Technologie

ArtTRUST utilise les technologies suivantes :

- **Ethereum** pour la blockchain et les contrats intelligents.
- **React** pour l'interface utilisateur.
- **Web3.js** pour l'interaction entre l'interface utilisateur et la blockchain Ethereum.
- **Bootstrap** pour le stylisme de l'interface utilisateur.
- **OpenZeppelin** pour des contrats intelligents sécurisés.

## Déploiement des contrats intelligents

## Déploiement des contrats intelligents

1. Assurez-vous d'avoir [Truffle] installé sur votre machine.
2. Naviguez vers le répertoire `contracts/` et déployez les contrats en utilisant la commande `truffle migrate --network [nom_du_reseau]`.
3. Prenez note des adresses des contrats déployés. Vous aurez besoin de ces adresses pour les intégrer dans votre application front-end.


4. Une fois les contrats déployés, un nouveau dossier `build/` sera généré. Copiez le dossier `contracts/` qui se trouve à l'intérieur du dossier `build/` et collez-le dans le dossier `src/` de votre application front-end.


## Utilisation

Assurez-vous d'avoir installé [Node.js] et [npm] sur votre machine.

1. Clonez ce dépôt.
2. Installez les dépendances en exécutant `npm install`.
3. Remplacez les adresses des contrats dans le code front-end par celles que vous avez obtenues lors du déploiement des contrats.
4. Démarrez l'application en exécutant `npm start`.
5. Ouvrez votre navigateur web et accédez à `http://localhost:3000`.
6. Assurez-vous que vous avez [MetaMask] installé dans votre navigateur et que vous êtes connecté à un réseau Ethereum pour interagir avec l'application.


