const express = require("express")
const router = express.Router()

const { viewApplication , downloadFile } = require("../controller/Common");
const { isLoggedin  } = require("../middleware/AuthMiddleware");

router.get("/view" ,isLoggedin , viewApplication );
router.post("/download" ,isLoggedin , downloadFile );


module.exports = router;