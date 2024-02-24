import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  addStream,
  getAllStreams,
  removeStream,
} from "../controllers/stream.controller.js";

const router = express.Router();

router.get("/", protect, getAllStreams);
router.post("/", protect, addStream);
router.patch("/:streamId", protect, removeStream);

export default router;
