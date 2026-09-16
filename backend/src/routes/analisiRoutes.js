import express from "express";
import {
  searchAndAnalyze,
  getHistory,
  getAnalisi,
  deleteAnalisi,
} from "../controllers/analisiController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/analyze", auth, searchAndAnalyze);
router.get("/history", auth, getHistory);
router.get("/:id", auth, getAnalisi);
router.delete("/:id", auth, deleteAnalisi);

export default router;
