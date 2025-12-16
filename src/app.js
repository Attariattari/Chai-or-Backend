import express from "express";

const app = express();

app.use(express.json());

// Sample route
app.get("/", (req, res) => {
  res.send("Welcome to the Chai-or Backend!");
});

export default app;
