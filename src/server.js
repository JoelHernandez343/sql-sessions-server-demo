import express from "express";
import fs from "fs/promises";
import https from "https";
import path from "path";
import * as url from "url";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

import { authUser } from "./userAuth.js";

// HTTPS information
const key = await fs.readFile("./key.pem");
const cert = await fs.readFile("./cert.pem");

// server creation
const app = express();
const server = https.createServer({ key, cert }, app);

// app config
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const frontend = path.join(__dirname, "../../sql-sessions-frontend");

// routes
app.get("/", (req, res) => {
  res.sendFile(path.join(frontend, "login.html"));
});

app.post("/login", async (req, res) => {
  const { body } = req;

  const auth = await authUser(body.userName, body.password);

  if (auth) {
    console.log(auth);
    res.send("ok");
  } else {
    res.status(403).sendFile(path.join(frontend, "error.html"));
  }
});

// default routes
app.use((req, res, next) => {
  res.status(404);

  // respond with html page
  if (req.accepts("html")) {
    res.sendFile(path.join(frontend, "404.html"));
    return;
  }

  // respond with json
  if (req.accepts("json")) {
    res.json({ error: "Not found" });
    return;
  }

  // default to plain-text. send()
  res.type("txt").send("Not found");
});

// start server
server.listen(8080, () => console.log("Running secure server!"));
