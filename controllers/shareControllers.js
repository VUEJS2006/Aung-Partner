import db from "../config/db.js";
import { asyncHandel } from "../middleware/asyncMiddleware.js";

export const shareCreate = asyncHandel(async (req, res) => {
    try {

        const {
            shareholder_id,
            share_class,
            share_quantity,
            price_per_share,
            total_investment,
            nominee_name,
            relationship,
            phone,
            bank_name1,
            account_name1,
            account_number1,
            bank_name2,
            account_name2,
            account_number2,
            kpay,
            wave
        } = req.body;

        const [data] = await db.query(`
            INSERT INTO shares (
                shareholder_id,
                share_class,
                share_quantity,
                price_per_share,
                total_investment,
                nominee_name,
                relationship,
                phone,
                bank_name1,
                account_name1,
                account_number1,
                bank_name2,
                account_name2,
                account_number2,
                kpay,
                wave
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        `, [
            shareholder_id,
            share_class,
            share_quantity,
            price_per_share,
            total_investment,
            nominee_name,
            relationship,
            phone,
            bank_name1,
            account_name1,
            account_number1,
            bank_name2,
            account_name2,
            account_number2,
            kpay,
            wave
        ]);

        res.status(201).json({
            success: true,
            message: "Share Created Successfully!",
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


export const shareList = asyncHandel(async (req, res) => {
    try {

        const [data] = await db.query(`
            SELECT 
                sh.*,
                s.username,
                s.email
            FROM shares sh
            LEFT JOIN shareholders s
            ON sh.shareholder_id = s.id
            ORDER BY sh.id DESC
        `);

        res.status(200).json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export const shareDetail = asyncHandel(async (req, res) => {
    try {

        const { id } = req.params;

        const [data] = await db.query(`
            SELECT 
                sh.*,
                s.username,
                s.email
            FROM shares sh
            LEFT JOIN shareholders s
            ON sh.shareholder_id = s.id
            WHERE sh.id = ?
        `, [id]);

        if (data.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Share not found"
            });
        }

        res.status(200).json({
            success: true,
            data: data[0]
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


export const shareUpdate = asyncHandel(async (req, res) => {
    try {

        const { id } = req.params;

        const {
            share_class,
            share_quantity,
            price_per_share
        } = req.body;

        const qty = Number(share_quantity);
        const price = Number(price_per_share);
        const buyTotal = qty * price;

        const [share] = await db.query(
            "SELECT * FROM shares WHERE id = ?",
            [id]
        );

        if (share.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Share not found"
            });
        } await db.query(
            `UPDATE shares
             SET
                share_class = ?,
                share_quantity = share_quantity + ?,
                price_per_share = price_per_share + ?,
                total_investment = total_investment + ?
             WHERE id = ?`,
            [
                share_class,
                qty,
                price,
                buyTotal,
                id
            ]
        );

        const [updatedData] = await db.query(
            "SELECT * FROM shares WHERE id = ?",
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "Share updated successfully",
            data: updatedData[0]
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// export const buyMoreShare = asyncHandel(async (req, res) => {
//     try {

//         const {
//             shareholder_id,
//             share_quantity,
//             price_per_share
//         } = req.body;

//         const qty = Number(share_quantity);
//         const price = Number(price_per_share);

//         const [share] = await db.query(
//             `SELECT * FROM shares WHERE shareholder_id = ?`,
//             [shareholder_id]
//         );

//         if (share.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Shareholder not found"
//             });
//         }

//         const buyTotal = qty * price;

//         await db.query(
//             `UPDATE shares
//              SET
//                 share_quantity = share_quantity + ?,
//                 price_per_share = price_per_share + ?,
//                 total_investment = total_investment + ?
//              WHERE shareholder_id = ?`,
//             [
//                 qty,
//                 price,
//                 buyTotal,
//                 shareholder_id
//             ]
//         );

//         const [updatedData] = await db.query(
//             `SELECT * FROM shares WHERE shareholder_id = ?`,
//             [shareholder_id]
//         );

//         return res.status(200).json({
//             success: true,
//             message: "Share added successfully",
//             data: updatedData[0]
//         });

//     } catch (error) {
//         console.log(error);

//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// });

export const shareDelete = asyncHandel(async (req, res) => {
    try {

        const { id } = req.params;

        await db.query(`
            DELETE FROM shares
            WHERE id = ?
        `, [id]);

        res.status(200).json({
            success: true,
            message: "Share deleted successfully"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Mobile 

export const userShareList = asyncHandel(async (req, res) => {
    try {

        const shareholder_id = req.user.id;

        const [data] = await db.query(`
            SELECT
                sh.id,
                sh.shareholder_id,
                sh.share_class,
                sh.share_quantity,
                sh.price_per_share,
                sh.total_investment,
                sh.nominee_name,
                sh.relationship,
                sh.phone,
                sh.bank_name1,
                sh.account_name1,
                sh.account_number1,
                sh.bank_name2,
                sh.account_name2,
                sh.account_number2,
                sh.kpay,
                sh.wave,
                sh.level_info_setup
            FROM shares sh
            LEFT JOIN shareholders s
            ON sh.shareholder_id = s.id
            WHERE sh.shareholder_id = ?
            ORDER BY sh.id DESC
        `, [shareholder_id]); if (data.length === 0) {

            return res.status(200).json({
                success: true,
                popup_open: true,
                data: []
            });

        }

        res.status(200).json({
            success: true,
            popup_open: false,
            count: data.length,
            data
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
});


export const userShareCreate = asyncHandel(async (req, res) => {
    try {

        const shareholder_id = req.user.id;

        const {
            nominee_name,
            relationship,
            phone,
            bank_name1,
            account_name1,
            account_number1,
            bank_name2,
            account_name2,
            account_number2,
            kpay,
            wave
        } = req.body;

        // already submitted check
        const [checkUser] = await db.query(`
            SELECT *
            FROM shares
            WHERE shareholder_id = ?
        `, [shareholder_id]);

        if (checkUser.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Already submitted"
            });
        }

        // create
        const [data] = await db.query(`
            INSERT INTO shares (
                shareholder_id,
                nominee_name,
                relationship,
                phone,
                bank_name1,
                account_name1,
                account_number1,
                bank_name2,
                account_name2,
                account_number2,
                kpay,
                wave
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            shareholder_id,
            nominee_name,
            relationship,
            phone,
            bank_name1,
            account_name1,
            account_number1,
            bank_name2,
            account_name2,
            account_number2,
            kpay,
            wave
        ]);

        // update bool field
        await db.query(`
            UPDATE shares
            SET level_info_setup = true
            WHERE id = ?
        `, [data.insertId]);

        // return data
        const [newData] = await db.query(`
            SELECT *
            FROM shares
            WHERE id = ?
        `, [data.insertId]);

        res.status(201).json({
            success: true,
            message: "Level info created successfully",
            data: newData[0]
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
});