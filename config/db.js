import "dotenv/config";
import mysql from "mysql2/promise";

console.log("ENV CHECK =>", {
  HOST: process.env.HOST,
  USER: process.env.DB_USER,
  PASS: process.env.PASS,
  DB: process.env.DB,
});

const db = mysql.createPool({
  host: process.env.HOST,
  user: process.env.DB_USER,
  password: process.env.PASS,
  database: process.env.DB,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default db;