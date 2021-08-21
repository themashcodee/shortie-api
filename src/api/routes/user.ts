import express from "express";
const router = express.Router();
import { signup, signin, refreshToken, logout } from "../controllers/user";

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/refreshtoken", refreshToken);
router.post("/logout", logout);

export default router;
