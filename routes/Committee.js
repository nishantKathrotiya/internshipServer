const express = require("express")
const router = express.Router()

const {dashboard , updateStatus } = require("../controller/Committee");
const { isLoggedin , isCommittee } = require("../middleware/AuthMiddleware");

router.get("/dashboard" ,isLoggedin , isCommittee , dashboard );
router.post("/update" ,isLoggedin , isCommittee , updateStatus );


module.exports = router;