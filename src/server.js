import express from "express";
import session from "express-session";
import fs from "fs/promises";
import https from "https";
import path from "path";
import * as url from "url";
// const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

// import { authDb } from "./userAuth.js";
import { router as sessionRouter } from "./routes/session.js";
import { router as adminRouter } from "./routes/admin.js";
import { router as userRouter } from "./routes/user.js";

// HTTPS information
const key = await fs.readFile("./key.pem");
const cert = await fs.readFile("./cert.pem");

// server creation
const app = express();
const server = https.createServer({ key, cert }, app);

// app config
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "this-is-a-long-long-secret-string",
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      secure: true,
    },
    resave: false,
    saveUninitialized: false,
  })
);

const frontend = path.join(__dirname, "../../sql-sessions-frontend");

// routes
app.use("/", sessionRouter);
app.use("/", adminRouter);
app.use("/", userRouter);

app.get("/scripts/landing.js", (req, res) => {
  res.sendFile(path.join(frontend, "landing.js"));
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
