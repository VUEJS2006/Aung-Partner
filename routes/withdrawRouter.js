import express from "express"
import { createWithDraw, listWithDraw, statusWithDraw } from "../controllers/withdrawController.js"
import { isAdmin, isAuth } from "../middleware/authMiddleware.js";
import { verifyPasscode } from "../middleware/passcodeMiddleware.js";
const router = express.Router()

router.get('/withdraw/list', isAuth, isAdmin, listWithDraw);
router.put('/withdraw/change/status/:id', isAuth, isAdmin, verifyPasscode, statusWithDraw)
// Mobile
router.post("/withdraw/create/v1", isAuth, createWithDraw);
export default router;