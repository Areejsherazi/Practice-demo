const connectDB = require("./config/DataBase.js");
const express = require("express");
const dotenv = require("dotenv");
const signUpRouters = require("./routers/signUpRouters");
const app = express();
dotenv.config();

connectDB();

app.use(express.json());

app.use("/", signUpRouters);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});