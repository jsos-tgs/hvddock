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
  const scope = "user-read-private user-read-email playlist-read-private";
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
      const uri = process.env.FRONTEND_URI || "http://localhost:3000";
      res.redirect(uri + "?access_token=" + access_token);
    } else {
      res.status(500).send("Authentication failed");
    }
  });
});

// Nouveau endpoint pour récupérer les morceaux d'une playlist spécifique
app.get("/playlist", (req, res) => {
  const access_token = req.query.access_token;
  const playlist_id = "4zjlYCDG8fX7Nmw8IpV78T"; // Remplace par l'ID de ta playlist cible

  const options = {
    url: `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
    headers: { Authorization: "Bearer " + access_token },
    json: true,
  };

  request.get(options, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const tracks = body.items
        .filter((item) => item.track.preview_url) // Filtrer les morceaux avec un extrait audio
        .map((item) => ({
          name: item.track.name,
          artist: item.track.artists[0].name,
          preview_url: item.track.preview_url,
        }));
      res.json(tracks);
    } else {
      console.error("Error fetching playlist:", body);
      res.status(500).send("Failed to fetch playlist tracks");
    }
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
