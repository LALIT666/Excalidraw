import express from "express";

const app = express();
const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server  is healthy" });
});

app.listen(PORT, () => {
  console.log(`Server is running http://localhost:${PORT}`);
});
