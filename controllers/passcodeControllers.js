import { asyncHandel } from "../middleware/asyncMiddleware.js";
import db from "../config/db.js";
import { ChangePassword } from "./authControllers.js";

export const createPasscode = asyncHandel(async (req, res) => {

    const { passcode } = req.body;
    if (!passcode) {
        return res.status(401).json({
            success: false,
            message: "Required!",
        });
    }
    await db.query(
        "INSERT INTO passcodes (passcode) VALUES (?)",
        [passcode]
    );

    res.status(201).json({
        success: true,
        message: "Passcode created",
    });
});

export const getPasscodes = asyncHandel(async (req, res) => {
    const [data] = await db.query(
        "SELECT * FROM passcodes ORDER BY id DESC"
    );

    res.json({
        success: true,
        data,
    });
});


export const deletePasscode = asyncHandel(async (req, res) => {
    const { id } = req.params;

    await db.query(
        "DELETE FROM passcodes WHERE id=?",
        [id]
    );

    res.json({
        success: true,
        message: "Passcode deleted",
    });
});

export const ChangePasscode = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        const { passcode, confirmPasscode } = req.body;

        if (passcode !== confirmPasscode) {
            return res.status(401).json({
                success: false,
                message: 'Passcode is Not Same!',
            });
        }
        const [data] = await db.query("UPDATE passcodes SET passcode=? WHERE id = ?", [passcode,id]);
        return res.status(200).json({
            success: true,
            message: "Change Passcode Success!",
           
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
})
