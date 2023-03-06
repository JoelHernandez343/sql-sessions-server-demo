import sqlite3 from "sqlite3";
import fs from "fs/promises";

const db = new sqlite3.Database("./db.sqlite");

const errorLog = err => !err || console.log(err);

const usersRaw = await fs.readFile("./users.json");
const users = JSON.parse(usersRaw);

db.serialize(() => {
  db.run(
    "CREATE TABLE users (userName TEXT CONSTRAINT id PRIMARY KEY, password STRING, admin INTEGER)",
    errorLog
  );

  const stmt = db.prepare("INSERT INTO users VALUES (?, ?, ?)");
  users.forEach(user => {
    stmt.run([user.userName, user.password, user.admin], errorLog);
  });
  stmt.finalize();

  console.log("Information created:");
  db.each("SELECT * FROM users", (err, row) => {
    console.log(`${JSON.stringify(row)}}`);
  });
});

db.close();
