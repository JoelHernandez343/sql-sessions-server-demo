import express from "express";
import path from "path";

import { authDb, checkIfNoSession, getUserTypeRoute } from "../userAuth.js";
import { frontend } from "../paths.js";

const router = express.Router();

router.get("/", checkIfNoSession, (req, res) => {
  res.sendFile(path.join(frontend, "login.html"));
});

router.post("/login", checkIfNoSession, async (req, res) => {
  const body = req.body;
  const user = await authDb(body.userName, body.password);

  console.log(user);

  if (user) {
    req.session.user = user;
    const route = getUserTypeRoute(user);
    res.redirect(route);
  } else {
    res.status(403).sendFile(path.join(frontend, "error.html"));
  }
});

router.get("/logout", (req, res) => {
  req.session?.destroy();
  res.redirect("/");
});

export { router };
