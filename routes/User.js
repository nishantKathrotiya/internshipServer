const express = require("express")
const router = express.Router()

const { login, signUp, sendOTP,updateUser , createAdmin} = require("../controller/Auth");
const { isLoggedin } = require("../middleware/AuthMiddleware");


router.post("/login", login);                   
router.post("/signup", signUp);                   
router.post("/sendotp", sendOTP);  
router.post("/updateuser",isLoggedin,updateUser);       
router.post("/adminsignup",createAdmin)

module.exports = router;