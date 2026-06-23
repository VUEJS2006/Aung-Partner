import express from "express";
import { getLastAmountByUser,LastAmountInsert,DividendListByUser,TransactionTotal,BuyListByUser,BuyStatus, DividendStatus, TransactionsCreate, TransactionsList, userTransactionsList } from "../controllers/transactionsController.js"
import { validateRegister, isAdmin, isAuth } from "../middleware/authMiddleware.js";
import { verifyPasscode } from "../middleware/passcodeMiddleware.js";
const router = express.Router();



router.get("/list/share/transactions", isAuth, isAdmin, TransactionsList);
router.post("/create/share/transactions", isAuth, isAdmin, verifyPasscode, TransactionsCreate);
// router.post("/create/last-amount", isAuth, isAdmin, createLastAmount);
// router.get("/list/last-amount", isAuth, isAdmin, lastAmountList);
router.get("/v1/list/share/transactions", isAuth, userTransactionsList);
// router.get("/v1/list/last-amount", isAuth, userLastAmount);
// router.put("/v1/update/last-amount/:id", isAuth, userLastAmountUpdate);
router.get("/v1/buy/status", isAuth, BuyStatus);
router.get("/v1/dividend/status", isAuth, DividendStatus);
router.get("/list/buy/status/:id",isAuth,isAdmin,BuyListByUser)
router.get("/list/dividend/status/:id",isAuth,isAdmin,DividendListByUser)
router.get("/v1/transactions/total",isAuth,TransactionTotal);
router.post("/insert/last-amount",isAuth,isAdmin,LastAmountInsert);
router.get("/v1/get/last-amount",isAuth,getLastAmountByUser)
export default router;