import express from "express";
import authRouter from "./routes/auth.routes";
import { verifyToken } from "./middleware/verifyToken.middleware";
import roomRouter from "./routes/room.routes";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server  is healthy" });
});

app.use("/api/v1/auth", authRouter);

app.use("/api/v1/room", verifyToken, roomRouter);

app.listen(PORT, () => {
  console.log(`Server is running http://localhost:${PORT}`);
});
