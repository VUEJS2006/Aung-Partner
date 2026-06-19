import "dotenv/config";
import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASS,
  database: process.env.DB,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default db;