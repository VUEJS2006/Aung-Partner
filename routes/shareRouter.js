import express from "express"
import {  userShareCreate, userShareList, shareCreate, shareList, shareDetail, shareUpdate, shareDelete } from "../controllers/shareControllers.js"
import { isAdmin, isAuth } from "../middleware/authMiddleware.js";
import { adminPasscode } from "../middleware/passcodeMiddleware.js";
const router = express.Router()

router.post("/share/create", isAuth, isAdmin, shareCreate);
router.get("/share/list", isAuth, isAdmin, shareList);
router.put("/share/update/:id", isAuth, isAdmin, adminPasscode, shareUpdate);
router.delete("/share/delete/:id", isAuth, isAdmin, adminPasscode, shareDelete);
router.get("/share/details/:id", isAuth, isAdmin, shareDetail);
// router.post("/share/more/buy", isAuth, isAdmin,adminPasscode, buyMoreShare)
// Mobile
router.get("/share/list/v1", isAuth, userShareList);
router.post("/share/create/v1", isAuth, userShareCreate);

export default router;


