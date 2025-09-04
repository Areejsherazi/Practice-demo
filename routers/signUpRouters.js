const signUpController = require("../controllers/SignUpcontroller");
const express = require("express");
const router = express.Router();

router.post("/signUp", signUpController.signUpController);// http://localhost:5000/api/signUp


module.exports = router;