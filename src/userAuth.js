import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

import { frontend } from "./paths.js";

export async function authDb(userName, password) {
  let result = false;

  const db = await open({
    filename: "./db.sqlite",
    driver: sqlite3.Database,
  });

  try {
    const rows = await db.all(
      `SELECT * FROM users WHERE userName = "${userName}" AND password = "${password}"`
    );
    result = rows.length > 0 ? rows[0] : false;
  } catch (e) {
    console.log(e);
    result = false;
  }

  await db.close();

  return result;
}

export const getUserTypeRoute = user => {
  if (user.admin === 0) {
    return `/user/${user.userName}`;
  } else {
    return `/admin/${user.userName}`;
  }
};

export const checkIfNoSession = (req, res, next) => {
  const user = req.session?.user;

  if (!user) {
    next();
    return;
  }

  const route = getUserTypeRoute(user);
  res.redirect(route);
};

const checkUserType = (req, res, next, type) => {
  const user = req.session?.user;

  if (user && user.admin === type) {
    next();
    return;
  }

  res.status(403).sendFile(path.join(frontend, "error.html"));
};

export const checkIfIsUser = (req, res, next) =>
  checkUserType(req, res, next, 0);

export const checkIfIsAdmin = (req, res, next) =>
  checkUserType(req, res, next, 1);

export const checkUserParamUserSessionEquality = (req, res, next) => {
  const userNameParam = req.params.userName;
  const userNameSession = req.session.user.userName;

  if (userNameParam === userNameSession) {
    next();
    return;
  }

  res.status(403).sendFile(path.join(frontend, "error.html"));
};
