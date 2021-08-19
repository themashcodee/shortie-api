import express from "express";
const router = express.Router();
import { getAll } from "../controllers/link";

router.get("/getall", getAll);

export default router;
