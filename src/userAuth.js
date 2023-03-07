import sqlite3 from "sqlite3";
import { open } from "sqlite";

const user = {
  userName: "Joel",
  password: "1234",
};

export async function authUser(userName, password) {
  let result = false;

  const db = await open({
    filename: "./db.sqlite",
    driver: sqlite3.Database,
  });

  const sql = "SELECT * FROM users WHERE userName = ? AND password = ? ";

  try {
    const rows = await db.all(sql, [userName, password]);
    console.log(rows);
    result = rows.length > 0;
  } catch (e) {
    console.log(e);
    result = false;
  }

  await db.close();

  return result;
}
