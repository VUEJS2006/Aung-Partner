import express from "express";
import { AdminChangePassword, AdminProfileUpdate, verifyOTP, AccountDelete, ChangePassword, registerList, register, login, logout, pendingUser, approvedUser, cancelledUser, pendingCheckUser, getProfile, updateProfile } from "../controllers/authControllers.js"
import { validateRegister, isAdmin, isAuth } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";
import { verifyPasscode } from "../middleware/passcodeMiddleware.js";
const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/verify/otp', verifyOTP);
router.post('/login', login);
router.get('/register/list', registerList);
router.post('/logout', logout);
router.get('/profile/user/:id', isAuth, getProfile);
router.put('/update/profile/:id', isAuth, upload.single("image"), updateProfile);
router.put('/admin/update/profile/:id', isAuth, isAdmin, upload.single("image"), AdminProfileUpdate);
router.get('/pending/check/user', isAuth, isAdmin, pendingCheckUser);
router.put('/approved/user/:id', isAuth, isAdmin, verifyPasscode, approvedUser);
router.put('/cancelled/user/:id', isAuth, isAdmin, verifyPasscode, cancelledUser);
router.put('/pending/user/:id', isAuth, isAdmin, verifyPasscode, pendingUser)
router.put('/change/password/:id', isAuth, ChangePassword);
router.delete('/account/delete/:id', isAuth, AccountDelete);
router.put('/admin/change/password/:id', isAuth, isAdmin, AdminChangePassword);
export default router;