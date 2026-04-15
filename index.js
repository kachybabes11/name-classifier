import express from "express";
import cors from "cors";
import profileRoutes from "./routes/profileRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api", profileRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});