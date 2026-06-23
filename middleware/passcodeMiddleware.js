import db from "../config/db.js";
import { asyncHandel } from "./asyncMiddleware.js";

export const verifyPasscode = asyncHandel(async (req, res, next) => {
    const passcode = req.headers['x-passcode'];
    if (!passcode) {
        return res.status(401).json({
            success: false,
            message: "Passcode is required",
        });
    }
    const [rows] = await db.query(
        "SELECT passcode FROM passcodes ORDER BY id DESC LIMIT 1"
    );
    if (rows.length === 0) {
        return res.status(404).json({
            success: false,
            message: "Passcode not found",
        });
    }
    if (rows[0].passcode !== passcode) {
        return res.status(401).json({
            success: false,
            message: "Invalid passcode",
        });
    }
    next();
})