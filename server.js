import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import db from "./config/db.js";

import authRouter from "./routes/authRouters.js";
import memberRouter from "./routes/memberRouters.js";
import adminContactRouter from "./routes/adminContactRouters.js";
import shareRouter from "./routes/shareRouter.js";
import transactionRouter from "./routes/transactionsRouter.js";
import conditionRouter from "./routes/conditionRouter.js";

const app = express();

try {
    const conn = await db.getConnection();
    console.log("DB is connected");
    conn.release();
} catch (err) {
    console.log("Fail", err);
}

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/api', memberRouter);
app.use('/api', adminContactRouter);
app.use('/api', shareRouter);
app.use('/api', transactionRouter);
app.use('/api', conditionRouter);

app.use('/uploads', express.static('image/uploads'));

app.get('/', (req, res) => {
    res.send("Hello Bagan-360");
});

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});