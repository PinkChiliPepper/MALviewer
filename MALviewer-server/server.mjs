import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to handle CORS
app.use(cors());
app.use(express.json());

// MyAnimeList OAuth endpoints and client credentials
const MAL_CLIENT_ID = process.env.MAL_CLIENT_ID;
const MAL_CLIENT_SECRET = process.env.MAL_CLIENT_SECRET;
const MAL_REDIRECT_URI = `${process.env.BASE_URL}/mal-auth/callback`;
const TOKEN_ENDPOINT = "https://myanimelist.net/v1/oauth2/token";

app.post("/auth/exchange", async (req, res) => {
  const { code, code_verifier } = req.body;

  try {
    const response = await axios.post(
      TOKEN_ENDPOINT,
      new URLSearchParams({
        client_id: MAL_CLIENT_ID,
        client_secret: MAL_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: MAL_REDIRECT_URI,
        code_verifier,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${btoa(
            `${MAL_CLIENT_ID}:${MAL_CLIENT_SECRET}`
          )}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error exchanging code for token", error);
    res.status(500).send(error);
  }
});

app.get("/user", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(400).send("No token provided");

  try {
    const url = "https://api.myanimelist.net/v2/users/@me";
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching user info", error);
    res.status(500).send(error);
  }
});

app.get("/users/:username/animelist", async (req, res) => {
  const { username } = req.params;
  const { status } = req.query;
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(400).send("No token provided");

  try {
    let url = `https://api.myanimelist.net/v2/users/${username}/animelist`;
    if (status) url += `?status=${status}`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching user animelist", error);
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
