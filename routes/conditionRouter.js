import express from "express"
import {conditionList,conditionCreate,conditionUpdate,conditionDelete } from "../controllers/conditionControllers.js";
import { isAdmin,isAuth } from "../middleware/authMiddleware.js";

const router = express.Router()
router.get("/list/condition",isAuth,conditionList);
router.post("/create/condition",isAuth,isAdmin,conditionCreate);
router.put("/update/condition/:id",isAuth,isAdmin,conditionUpdate);
router.delete("/delete/condition/:id",isAuth,isAdmin,conditionDelete);

export default router

