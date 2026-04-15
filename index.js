import express from "express";
import cors from "cors";
import profileRoutes from "./routes/profileRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api", profileRoutes);

app.get("/db-test", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");
    res.json({
      status: "connected",
      time: result.rows[0]
    });
  } catch (err) {
    console.error("DB CONNECTION ERROR:", err);
    res.status(500).json({
      status: "not connected",
      error: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});