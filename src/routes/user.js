import express from "express";
import path from "path";

import {
  checkIfIsUser,
  checkUserParamUserSessionEquality,
} from "../userAuth.js";
import { frontend } from "../paths.js";

const router = express.Router();

router.get("/userCommon/:fileName", checkIfIsUser, (req, res) => {
  console.log(req.params.fileName);
  res.send(req.params.fileName);
});

router.get(
  "/user/:userName",
  checkIfIsUser,
  checkUserParamUserSessionEquality,
  (req, res) => {
    // respond with html page
    if (req.accepts("html")) {
      // res.sendFile(path.join(frontend, "404.html"));
      console.log(req.params);
      res.send(`You are user! ${req.session.user.userName}`);
      return;
    }

    // respond with json
    if (req.accepts("json")) {
      res.json({ userName: req.session.user.userName });
      return;
    }

    res.type("txt").send("You are user!");
  }
);

router.get(
  "/user/:userName/:fileName",
  checkIfIsUser,
  checkUserParamUserSessionEquality,
  (req, res) => {
    console.log(req.params.fileName);
    res.send(req.params.fileName);
  }
);

export { router };
