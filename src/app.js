import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173/",
    credentials: true,
  })
);
// Sample route
app.get("/", (req, res) => {
  res.send("Welcome to the Chai-or Backend!");
});

export default app;
