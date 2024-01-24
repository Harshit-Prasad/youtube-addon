import express from "express";
import {
  getUserCredentials,
  setUserCredentials,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/", setUserCredentials);
router.get("/:token", getUserCredentials);

export default router;
