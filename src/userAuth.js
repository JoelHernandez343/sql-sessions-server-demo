import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function authUser(userName, password) {
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
