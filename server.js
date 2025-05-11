import express from "express";
import dotenv from "dotenv";
import routes from "./Routes/routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use("/spotify", routes);

app.get("/", (req, res) => {
  res.send("Spotify backend API is working ");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
