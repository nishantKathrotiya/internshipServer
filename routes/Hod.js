const express = require("express")
const router = express.Router()

const {dashboard , updateStatus  } = require("../controller/Hod");
const { isLoggedin , isHod } = require("../middleware/AuthMiddleware");

router.get("/dashboard" ,isLoggedin , isHod , dashboard );
router.post("/update" ,isLoggedin , isHod , updateStatus );


module.exports = router;