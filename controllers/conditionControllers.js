import { json } from "express";
import db from "../config/db.js";
import { asyncHandel } from "../middleware/asyncMiddleware.js";


export const conditionList = asyncHandel(async (req, res) => {
    try {
        const [data] = await db.query("SELECT * FROM conditions ORDER BY id DESC");
        return res.status(200).json({
            message: "List Success!",
            success: true,
            count: data.length,
            data
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: err.message,
            success: false
        })
    }
})

export const conditionCreate = asyncHandel(async (req, res) => {
    try {

        const { title, message } = req.body;
        if (!message) {
            return res.status(400).json({
                message: "All field are required!",
                success: false
            })
        }
        const [data] = await db.query("INSERT INTO conditions (title,message) VALUES (?,?)", [title, message]);
        return res.status(201).json({
            message: "Term and Condition Create Success",
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

export const conditionUpdate = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        const { title, message } = req.body;
        const [data] = await db.query("UPDATE conditions SET title = ?,message = ? WHERE id = ?", [title, message, id]);
        return res.status(200).json({
            message: "List Success!",
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

export const conditionDelete = asyncHandel(async (req, res) => {
    try {

        const { id } = req.params;
        const [data] = await db.query("DELETE FROM conditions WHERE id = ?", [id]);
        return res.status(200).json({
            message: "Delete Success!",
            success: true
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: err.message,
            success: false
        })
    }
})