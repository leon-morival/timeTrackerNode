const mysql = require("mysql");
require("dotenv").config();

// Fonction pour créer la connexion avec retry
const createConnection = () => {
  console.log("Tentative de connexion à la base de données...");
  console.log(`Host: ${process.env.DB_HOST}, Database: ${process.env.DB_NAME}`);

  var connection = mysql.createPool({
    host: "127.0.0.1",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectTimeout: 10000, // Augmenter le délai d'attente de connexion
    acquireTimeout: 10000, // Augmenter le délai d'acquisition
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  return connection;
};

var connection = createConnection();

// Fonction de vérification de connexion avec retry
const testConnection = (retries = 5, delay = 5000) => {
  if (retries === 0) {
    console.error(
      "Échec de la connexion après plusieurs tentatives. Vérifiez vos paramètres de connexion."
    );
    return;
  }

  connection.query(
    "SELECT 1 + 1 AS solution",
    function (error, results, fields) {
      if (error) {
        console.error(
          "Erreur de connexion à la base de données:",
          error.message
        );
        console.log(
          `Nouvelle tentative dans ${
            delay / 1000
          } secondes. Tentatives restantes: ${retries - 1}`
        );

        setTimeout(() => {
          testConnection(retries - 1, delay);
        }, delay);
      } else {
        console.log("Connected to MySQL database successfully!");
      }
    }
  );
};

// Attendre que MySQL soit prêt avant de tester la connexion
setTimeout(() => {
  testConnection();
}, 10000); // Attendre 10 secondes au démarrage

module.exports = connection;
