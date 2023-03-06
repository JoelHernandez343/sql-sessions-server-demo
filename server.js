import express from "express";
import fs from "fs/promises";
import https from "https";

// HTTPS information
const key = await fs.readFile("./key.pem");
const cert = await fs.readFile("./cert.pem");

// server creation
const app = express();
const server = https.createServer({ key, cert }, app);

// routes
app.get("/", (req, res) => {
  console.log("hmmm");
  res.send("Hello from https!");
});

// start server
server.listen(8080, () => console.log("Running secure server!"));
