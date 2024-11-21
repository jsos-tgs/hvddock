const express = require("express");
const request = require("request");
const path = require("path");
const querystring = require("querystring");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const redirect_uri =
  process.env.REDIRECT_URI || `http://localhost:${PORT}/callback`;

app.use(express.static(path.join(__dirname, "public")));

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
      res.status(500).send("Authentication failed");
    }
  });
});

// Endpoint pour récupérer les morceaux d'un artiste spécifique
app.get("/artist", (req, res) => {
  const access_token = req.query.access_token;
  const artist_id = "2VIJqCnSUPFwbtL0S6mUvT"; // ID de l'artiste cible

  const options = {
    url: `https://api.spotify.com/v1/artists/${artist_id}/albums?include_groups=album,single&limit=50`,
    headers: { Authorization: "Bearer " + access_token },
    json: true,
  };

  // Étape 1 : Récupérer les albums et singles de l'artiste
  request.get(options, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const album_ids = body.items.map((album) => album.id);

      // Étape 2 : Récupérer les morceaux de chaque album
      const trackPromises = album_ids.map((album_id) => {
        return new Promise((resolve, reject) => {
          const trackOptions = {
            url: `https://api.spotify.com/v1/albums/${album_id}/tracks`,
            headers: { Authorization: "Bearer " + access_token },
            json: true,
          };

          request.get(trackOptions, (err, resp, albumBody) => {
            if (!err && resp.statusCode === 200) {
              resolve(albumBody.items);
            } else {
              reject(err);
            }
          });
        });
      });

      // Combiner tous les morceaux
      Promise.all(trackPromises)
        .then((trackLists) => {
          const tracks = trackLists
            .flat()
            .filter((track) => track.preview_url) // Garder uniquement les morceaux avec un extrait audio
            .map((track) => ({
              name: track.name,
              artist: track.artists[0].name,
              preview_url: track.preview_url,
            }));
          res.json(tracks);
        })
        .catch((err) => {
          console.error("Error fetching tracks:", err);
          res.status(500).send("Failed to fetch tracks");
        });
    } else {
      console.error("Error fetching artist albums:", body);
      res.status(500).send("Failed to fetch artist albums");
    }
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
