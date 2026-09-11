import express from "express";
import {
  analyzeRecensioni,
  getHistory,
  getAnalisi,
  deleteAnalisi,
} from "../controllers/analisiController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/analyze", auth, analyzeRecensioni);
router.get("/history", auth, getHistory);
router.get("/:id", auth, getAnalisi);
router.delete("/:id", auth, deleteAnalisi);

export default router;
