import express from "express";
import path from "path";

import {
  checkIfIsAdmin,
  checkUserParamUserSessionEquality,
} from "../userAuth.js";
import { frontend } from "../paths.js";
import {
  getCommonFilePath,
  getCommonFilesNames,
  getPersonalFilePath,
  getPersonalFilesNames,
} from "../file.js";

const jsonPersonalResponse = async (query, user) => {
  if (!query || !query.request) {
    return [{ error: "query.request expected" }, 404];
  }

  if (query.request === "data") {
    return [{ ...user }, 200];
  }
  if (query.request === "files") {
    return [{ files: await getPersonalFilesNames(user) }, 200];
  }

  return [{ error: "Bad query request" }, 404];
};

const jsonCommonResponse = async (query, userType) => {
  if (!query || !query.request) {
    return [{ error: "query.request expected" }, 404];
  }

  if (query.request === "files") {
    return [{ files: await getCommonFilesNames(userType) }, 200];
  }

  return [{ error: "Bad query request" }, 404];
};

const router = express.Router();

router.get("/adminCommon", checkIfIsAdmin, async (req, res) => {
  const userType = req.session.user.admin;

  if (req.accepts("json")) {
    const [response, code] = await jsonCommonResponse(req.query, userType);

    res.status(code).json(response);
    return;
  }
});

router.get("/adminCommon/:fileName", checkIfIsAdmin, (req, res) => {
  const userType = req.session.user.admin;
  const fileName = req.params.fileName;

  console.log(fileName);
  res.sendFile(path.join(getCommonFilePath(userType), fileName), err => {
    if (!err) return;
    res.status(404).sendFile(path.join(frontend, "404.html"));
  });
});

router.get(
  "/admin/:userName",
  checkIfIsAdmin,
  checkUserParamUserSessionEquality,
  async (req, res) => {
    if (Object.keys(req.query).length > 0) {
      const [response, code] = await jsonPersonalResponse(
        req.query,
        req.session.user
      );

      res.status(code).json(response);
      return;
    }

    if (req.accepts("html")) {
      res.sendFile(path.join(frontend, "admin-landpage.html"));
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
    const user = req.session.user;
    const fileName = req.params.fileName;

    console.log(fileName);
    res.sendFile(path.join(getPersonalFilePath(user), fileName), err => {
      if (!err) return;
      res.status(404).sendFile(path.join(frontend, "404.html"));
    });
  }
);

export { router };
