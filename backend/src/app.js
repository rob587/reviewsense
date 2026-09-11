import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import analisiRoutes from "./routes/analisiRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// importare routes
app.use("/api/auth", authRoutes);
app.use("/api/analisi", analisiRoutes);

app.get("/", (req, res) => {
  res.json({ message: "ReviewSense API funzionante" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Errore interno del server" });
});

export default app;
