const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;

// Configuration de la connexion à la base de données
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'node'
});

db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données :', err);
        return;
    }
    console.log('Connecté à la base de données MySQL');
});

// Configuration du moteur de modèle EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Middleware pour analyser les données de formulaire
app.use(express.urlencoded({ extended: false }));

// Middleware pour servir des fichiers statiques
app.use(express.static(__dirname + '/public'));

// Route principale
app.get('/', (req, res) => {
    // Exécutez une requête SQL pour récupérer des données de la base
    const query = 'SELECT * FROM utilisateurs';

    db.query(query, (err, données) => {
        if (err) {
            console.error('Erreur de requête SQL :', err);
            return;
        }

        // Rendre le modèle EJS et passer les données à afficher
        res.render('ajout', { données });
    });
});

// Route pour ajouter des données
app.post('/ajouter', (req, res) => {
    const { nom, email } = req.body;

    // Exécutez une requête SQL pour ajouter des données à la base
    const query = 'INSERT INTO utilisateurs (nom, email) VALUES (?, ?)';

    db.query(query, [nom, email], (err) => {
        if (err) {
            console.error('Erreur lors de l\'ajout de données :', err);
            return;
        }

        // Redirigez l'utilisateur vers la page d'accueil après l'ajout
        res.redirect('/');
    });
});

app.listen(port, () => {
    console.log(`Serveur en écoute sur le port ${port}`);
});
