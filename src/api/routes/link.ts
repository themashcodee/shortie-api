import express from "express";
const router = express.Router();
import { userDetails, addOne, deleteOne, updateOne } from "../controllers/link";

router.get("/userdetails", userDetails);
router.post("/addone", addOne);
router.delete("/deleteone", deleteOne);
router.post("/updateone", updateOne);

export default router;
