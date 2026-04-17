import express from "express";
import cors from "cors";
import profileRoutes from "./routes/profileRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/api/profiles", profileRoutes);



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});