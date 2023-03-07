import express from "express";
import path from "path";

import {
  checkIfIsAdmin,
  checkUserParamUserSessionEquality,
} from "../userAuth.js";
import { frontend } from "../paths.js";

const router = express.Router();

router.get("/adminCommon/:fileName", checkIfIsAdmin, (req, res) => {
  console.log(req.params.fileName);
  res.send(req.params.fileName);
});

router.get(
  "/admin/:userName",
  checkIfIsAdmin,
  checkUserParamUserSessionEquality,
  (req, res) => {
    // respond with html page
    if (req.accepts("html")) {
      // res.sendFile(path.join(frontend, "404.html"));
      console.log(req.params);
      res.send(`You are admin! ${req.session.user.userName}`);
      return;
    }

    // respond with json
    if (req.accepts("json")) {
      res.json({ userName: req.session.user.userName });
      return;
    }

    res.type("txt").send("You are admin!");
  }
);

router.get(
  "/admin/:userName/:fileName",
  checkIfIsAdmin,
  checkUserParamUserSessionEquality,
  (req, res) => {
    console.log(req.params.fileName);
    res.send(req.params.fileName);
  }
);

export { router };
