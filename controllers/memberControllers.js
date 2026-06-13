import db from "../config/db.js";
import { asyncHandel } from "../middleware/asyncMiddleware.js";

export const memberCreate = asyncHandel(async (req, res) => {
    try {

        const {
            shareholder_id,
            amount,
            join_date,
            share_percentage,
            introducer_name,
            relationship,
            bank_name1,
            bank_name2,
            bank_account_number1,
            bank_account_number2,
            bank_account_name1,
            bank_account_name2,
            kpay,
            wave,
        } = req.body;
        if (!shareholder_id || !amount || !share_percentage) {
            res.status(401).json({
                message: 'All field are required!',
                success: false
            })
        }


        const [data] = await db.query(`INSERT INTO members 
            (shareholder_id, amount, join_date, share_percentage, introducer_name, relationship, bank_name1, bank_name2, bank_account_number1, bank_account_number2, bank_account_name1, bank_account_name2, kpay, wave) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [
                shareholder_id,
                amount,
                join_date,
                share_percentage,
                introducer_name,
                relationship,
                bank_name1,
                bank_name2,
                bank_account_number1,
                bank_account_number2,
                bank_account_name1,
                bank_account_name2,
                kpay,
                wave
            ]);


        res.status(201).json({
            message: 'Member Create Successfully!',
            success: true,
            data: {
                data
            }
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: err.message,
            success: false
        })
    }
})

export const memberList = asyncHandel(async (req, res) => {
    try {

        const [data] = await db.query(`
            SELECT 
                m.id,
                m.shareholder_id,
                m.amount,
                m.join_date,
                m.share_percentage,
                m.introducer_name,
                m.relationship,
                m.bank_name1,
                m.bank_name2,
                m.bank_account_number1,
                m.bank_account_number2,
                m.bank_account_name1,
                m.bank_account_name2,
                m.kpay,
                m.wave,
                s.username
            FROM members m
            JOIN shareholders s ON m.shareholder_id = s.id
        `);

        res.status(200).json({
            message: 'Member Show Successfully!',
            success: true,
            count: data.length,
            data: {
                data
            }
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: err.message,
            success: false
        })
    }
})

export const memberUpdate = asyncHandel(async (req, res) => {

    try {

        const { id } = req.params;
        const { amount, join_date } = req.body;

        const [data] = await db.query("UPDATE members SET  amount = ? WHERE id = ?", [amount, id, join_date]);
        res.status(200).json({
            success: true,
            message: "Member Updated Successfully!",
            data: {
                data
            }
        });

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: err.message,
            success: false
        })
    }
})

export const memberDelete = asyncHandel(async (req, res) => {
    try {

        const { id } = req.params;

        const [data] = await db.query("DELETE FROM members WHERE id = ?", [id]);
        res.status(200).json({
            success: true,
            message: "Member Delete Successfully!",
        });

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: err.message,
            success: false
        })
    }
})