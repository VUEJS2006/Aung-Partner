import express from "express"
import { createPasscode, getPasscodes, deletePasscode, ChangePasscode } from "../controllers/passcodeControllers.js"
import { isAdmin, isAuth } from "../middleware/authMiddleware.js";

const router = express.Router()


router.post("/create/passcode", isAuth, isAdmin, createPasscode);
router.get("/get/passcode", isAuth, isAdmin, getPasscodes);
router.delete("/delete/passcode/delete/:id", isAuth, isAdmin, deletePasscode);
router.put("/change/passcode/:id", isAuth, isAdmin, ChangePasscode);
export default router;