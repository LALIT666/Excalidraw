import express from "express";
import authRouter from "./routes/auth.routes";

const app = express();
const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server  is healthy" });
});

app.get("/create-room", (req, res) => {
  res.json({
    message: "this is create-room end point",
  });
});

app.use("/api/v1/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server is running http://localhost:${PORT}`);
});
