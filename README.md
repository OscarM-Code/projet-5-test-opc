# Projet-5-Test-OPC

Ce projet est un projet de démonstration pour OpenClassrooms. Il s'agit d'une application web développée avec Angular pour le frontend et Java (Spring Boot) pour le backend. Le projet inclut également une base de données MySQL pour stocker les données.

## Installation

1. Cloner le projet depuis GitHub :

```bash
git clone https://github.com/OscarM-Code/projet-5-test-opc.git
```

2. Installer les dépendances pour le frontend (Angular) :

```bash
cd projet-5-test-opc/frontend
npm install
```

3. Installer les dépendances pour le backend (Java) :

Assurez-vous que vous avez Java JDK 8+ installé et configuré correctement sur votre système.


## Base de données MySQL

1. Assurez-vous d'avoir MySQL installé et en cours d'exécution sur votre machine.

2. Créez une nouvelle base de données dans MySQL.

3. Importez le fichier SQL projet_5_test_opc.sql situé dans le répertoire ressource dans votre base de données nouvellement créée.

## Collection Postman

1. Installez Postman si vous ne l'avez pas déjà fait.

2. Importez la collection Postman Projet-5-Test-OPC.postman_collection.json située dans le répertoire ressource.

## Tests Angular (unitaires et E2E)

### Tests unitaires

Pour exécuter les tests unitaires, exécutez la commande suivante :

```bash
cd frontend
npm run test
```
### Tests E2E

Pour executer les test end-to-en vous pouvez effectuer la commande :

```bash
cd frontend
npm run e2e
```

Et pour voir le pourcentage de couverture:

```bash
cd frontend
npm run e2e:coverage
```

## Tests Java

Pour exécuter les tests Java, exécutez la commande suivante :

```bash
cd backend
./mvnw test
```

Et pour voir la couverture des tests : 

```bash
cd backend
mvn clean jacoco:prepare-agent install jacoco:report
```

## Démarrer les applications

1. Démarrer l'application frontend (Angular) :

```bash
cd frontend
ng serve

```

2. Démarrer l'application backend (Java) :

```bash
cd backend
./mvnw spring-boot:run
```


L'application frontend sera accessible à l'adresse **http://localhost:4200/** */, tandis que l'application backend sera accessible à **http://localhost:8080/** */.