import db from "../config/db.js";
import { asyncHandel } from "../middleware/asyncMiddleware.js";


export const createWithDraw = asyncHandel(async (req, res) => {
    try {
        const shareholder_id = req.user.id;

        const { amount } = req.body;
        if (!amount || Number(amount) <= 0) {
            return res.status(400).json({
                message: "All field are required!",
                success: false
            })
        }

        const [data] = await db.query("INSERT INTO profit_withdrawals(amount,shareholder_id) VALUES (?,?)", [amount, shareholder_id]);

        return res.status(201).json({
            message: "Create Success!",
            success: true,
            data
        })

    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
})

export const listWithDraw = asyncHandel(async (req, res) => {
    try {

        const [data] = await db.query(`
             
            SELECT
             w.id,
             w.shareholder_id,
             w.amount,
             w.status,
             DATE_FORMAT(w.created_at, '%d-%m-%Y %h:%i %p') AS created_at,
             s.username

             FROM profit_withdrawals w LEFT JOIN shareholders s ON w.shareholder_id = s.id
             ORDER BY w.id DESC
            `)
        return res.status(200).json({
            success: true,
            message: "withdrawals successfully",
            data
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
})

export const statusWithDraw = asyncHandel(async (req, res) => {
    try {

        const { id } = req.params;
        const { status, shareholder_id } = req.body;
        const [checkUser] = await db.query("SELECT * FROM shareholders WHERE id = ?", [shareholder_id]);
        if (checkUser.length === 0) {
            return res.status(401).json({
                message: "User not found!",
                success: false
            })
        }

        const [data] = await db.query("UPDATE profit_withdrawals SET status = ?,shareholder_id = ? WHERE id = ?", [status, shareholder_id, id]);
        return res.status(201).json({
            message: "Update  Status Success!",
            success: true,
            data
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
})