import express from "express";
import {
  login,
  refreshToken,
  signup,
  verifyTokens,
  changeRole,
  verifyTokenV2
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-tokens", verifyTokens);
router.post("/refresh-token", refreshToken);
router.post("/verify-token/v2", verifyTokenV2);

router.patch("/role", changeRole);

export default router;
