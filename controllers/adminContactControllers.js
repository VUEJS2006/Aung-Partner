import db from "../config/db.js";
import { asyncHandel } from "../middleware/asyncMiddleware.js";

export const contactCreate = asyncHandel(async (req, res) => {
    try {

        const {
            name,
            email,
            phone1,
            phone2,
            telegram_channel1,
            telegram_channel2,
            telegram_name1,
            telegram_name2,
            viber_phone1,
            viber_phone2
        } = req.body;

        const [data] = await db.query(`
            INSERT INTO contact_us (
                name,
                email,
                phone1,
                phone2,
                telegram_channel1,
                telegram_channel2,
                telegram_name1,
                telegram_name2,
                viber_phone1,
                viber_phone2
            ) VALUES (?,?,?,?,?,?,?,?,?,?)
        `, [
            name,
            email,
            phone1,
            phone2,
            telegram_channel1,
            telegram_channel2,
            telegram_name1,
            telegram_name2,
            viber_phone1,
            viber_phone2
        ]);

        res.status(201).json({
            success: true,
            message: "Contact Created Successfully!",
            data
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

export const contactList = asyncHandel(async (req, res) => {
    try {

        const [data] = await db.query("SELECT * FROM contact_us ORDER BY id DESC");

        res.status(200).json({
            success: true,
            count: data.length,
            data
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});


export const contactUpdate = asyncHandel(async (req, res) => {
    try {

        const { id } = req.params;

        const {
            name,
            email,
            phone1,
            phone2,
            telegram_channel1,
            telegram_channel2,
            telegram_name1,
            telegram_name2,
            viber_phone1,
            viber_phone2
        } = req.body;

        const [data] = await db.query(`
            UPDATE contact_us SET
                name = ?,
                email = ?,
                phone1 = ?,
                phone2 = ?,
                telegram_channel1 = ?,
                telegram_channel2 = ?,
                telegram_name1 = ?,
                telegram_name2 = ?,
                viber_phone1 = ?,
                viber_phone2 = ?
            WHERE id = ?
        `, [
            name,
            email,
            phone1,
            phone2,
            telegram_channel1,
            telegram_channel2,
            telegram_name1,
            telegram_name2,
            viber_phone1,
            viber_phone2,
            id
        ]);

        res.status(200).json({
            success: true,
            message: "Contact Updated Successfully!",
            data
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

export const contactDelete = asyncHandel(async (req, res) => {
    try {

        const { id } = req.params;

        const [data] = await db.query(
            "DELETE FROM contact_us WHERE id = ?",
            [id]
        );

        res.status(200).json({
            success: true,
            message: "Contact Deleted Successfully!",
            data
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});