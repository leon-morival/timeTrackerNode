FROM node:16

WORKDIR /app

# Copier les fichiers de dépendances pour optimiser la mise en cache
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code source
COPY . .

# Exposer le port sur lequel l'application va fonctionner
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["node", "server.js"]
