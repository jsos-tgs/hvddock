const express = require("express");
const request = require("request");
const path = require("path");
const querystring = require("querystring");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const redirect_uri =
  process.env.REDIRECT_URI || `http://localhost:${PORT}/callback`;

// Cache en mémoire pour les données
const cache = {};

// Middleware pour servir des fichiers statiques et gérer les CORS
app.use(express.static(path.join(__dirname, "public")));
app.use(cors()); // Activation de CORS pour tous les navigateurs

// Route pour la connexion à Spotify
app.get("/login", (req, res) => {
  const scope = "user-read-private user-read-email";
  const spotifyAuthURL =
    "https://accounts.spotify.com/authorize?" +
    querystring.stringify({
      response_type: "code",
      client_id: process.env.CLIENT_ID,
      scope: scope,
      redirect_uri,
    });
  res.redirect(spotifyAuthURL);
});

// Route pour gérer le callback après l'authentification
app.get("/callback", (req, res) => {
  const code = req.query.code || null;

  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code: code,
      redirect_uri,
      grant_type: "authorization_code",
    },
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET
        ).toString("base64"),
    },
    json: true,
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token;
      const uri = process.env.FRONTEND_URI || `http://localhost:${PORT}`;
      res.redirect(uri + "?access_token=" + access_token);
    } else {
      console.error("Authentication failed:", error || body);
      res.status(500).send("Authentication failed");
    }
  });
});

// Endpoint pour récupérer les morceaux d'un artiste spécifique
app.get("/artist", (req, res) => {
  const access_token = req.query.access_token;
  const artist_id = "2VIJqCnSUPFwbtL0S6mUvT"; // ID de l'artiste cible

  if (!access_token) {
    return res.status(401).send("Access token is missing");
  }

  // Vérifier si les données sont en cache
  if (cache[artist_id]) {
    console.log("Serving from cache");
    return res.json(cache[artist_id]);
  }

  const options = {
    url: `https://api.spotify.com/v1/artists/${artist_id}/albums?include_groups=album,single&limit=10`, // Limite réduite à 10 albums
    headers: { Authorization: `Bearer ${access_token}` },
    json: true,
  };

  request.get(options, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      console.error("Error fetching artist albums:", error || body);
      return res.status(500).send("Failed to fetch artist albums");
    }

    const album_ids = body.items.map((album) => album.id);

    // Étape 2 : Récupérer les morceaux pour chaque album
    const trackPromises = album_ids.map((album_id) => {
      return new Promise((resolve, reject) => {
        const trackOptions = {
          url: `https://api.spotify.com/v1/albums/${album_id}/tracks`,
          headers: { Authorization: `Bearer ${access_token}` },
          json: true,
        };

        request.get(trackOptions, (err, resp, albumBody) => {
          if (err || resp.statusCode !== 200) {
            reject(err || albumBody);
          } else {
            resolve(albumBody.items);
          }
        });
      });
    });

    // Combiner tous les morceaux et filtrer les extraits audio
    Promise.all(trackPromises)
      .then((trackLists) => {
        const tracks = trackLists
          .flat()
          .filter((track) => track.preview_url) // Garde uniquement les morceaux avec un extrait audio disponible
          .map((track) => ({
            name: track.name,
            artist: track.artists[0].name,
            preview_url: track.preview_url,
          }));

        if (tracks.length === 0) {
          return res
            .status(404)
            .send("No playable tracks found for this artist.");
        }

        // Mettre les résultats en cache pour les futures requêtes
        cache[artist_id] = tracks;
        res.json(tracks);
      })
      .catch((err) => {
        console.error("Error fetching tracks:", err);
        res.status(500).send("Failed to fetch tracks");
      });
  });
});

// Lancer le serveur
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
