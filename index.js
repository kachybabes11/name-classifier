import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./config/db.js";
import profileRoutes from "./routes/profilesRoutes.js";

dotenv.config();

const app = express();

console.log("DATABASE_URL =>", process.env.DATABASE_URL);

// 🚀 CORS CONFIG
app.use(
  cors({
    origin: "*", // you can restrict this later to your frontend URL
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());


// TEST DB ROUTE
app.get("/test-db", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");

    res.json({
      status: "connected",
      time: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      status: "not connected",
      error: err.message,
    });
  
  }
});


// ROUTES
app.use("/api", profileRoutes);


// START SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});