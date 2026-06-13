import "dotenv/config"
import mysql from "mysql2/promise"

console.log("ENV CHECK =>", {
  HOST: process.env.HOST,
  USER: process.env.USER,
  PASS: process.env.PASS,
  DB: process.env.DB
})

const db = await mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASS,
  database: process.env.DB
})

export default db;