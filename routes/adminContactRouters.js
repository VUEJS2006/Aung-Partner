import express from "express"
import { contactCreate,contactList,contactUpdate,contactDelete } from "../controllers/adminContactControllers.js"
import { isAdmin,isAuth } from "../middleware/authMiddleware.js";

const router = express.Router()


router.get("/admin/contact/list",isAuth,isAdmin,contactList);
router.post("/admin/contact/create",isAuth,isAdmin,contactCreate);
router.put("/admin/contact/update/:id",isAuth,isAdmin,contactUpdate);
router.delete("/admin/contact/delete/:id",isAuth,isAdmin,contactDelete);
// Mobile
router.get("/admin/contact/list/v1",contactList);
export default router;