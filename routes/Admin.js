const express = require("express")
const router = express.Router()

const {dashboard , updateStatus } = require("../controller/Admin");
const { isLoggedin , isAdmin } = require("../middleware/AuthMiddleware");

router.get("/dashboard" ,isLoggedin,isAdmin,dashboard );
router.post("/update" ,isLoggedin,isAdmin,updateStatus );


module.exports = router;