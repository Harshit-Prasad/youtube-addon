import express from "express";
import {
  login,
  refreshToken,
  signup,
  verifyTokens,
  changeRole,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-tokens", verifyTokens);
router.post("/refresh-token", refreshToken);

router.patch("/role", changeRole);

export default router;
