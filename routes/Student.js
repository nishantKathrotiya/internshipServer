const express = require("express")
const router = express.Router()

const  { isLoggedin , isStudent, isAdmin } = require("../middleware/AuthMiddleware");
const {isValidForm,  isValidUpdateForm , isValidUpdate} = require("../middleware/validation")

const {viewApplication , downloadFile}  = require('../controller/Common');
const {newApplication,dashboard,editInitialData,updateApplication,editFile,deleteApplication } = require("../controller/Student");

const {upload} = require("../config/multerConfig");

router.post("/application",isLoggedin , isStudent, upload.fields([
    { name: 'conferenceAcceptance', maxCount: 1 },
    { name: 'regFeesProof', maxCount: 1 },
    { name: 'indexingProof', maxCount: 1 }
]),isValidForm ,newApplication);

router.get('/download' ,isLoggedin,downloadFile );
router.get("/viewapplication",isLoggedin,viewApplication);
router.get("/dashboard",isLoggedin,isStudent,dashboard );
router.get('/initalData',isLoggedin,isStudent,isValidUpdate,editInitialData );
router.post("/update",isLoggedin,isStudent,isValidUpdate,isValidUpdateForm,updateApplication);
router.delete('/delete',isLoggedin,isStudent,isValidUpdate,deleteApplication );

router.post("/editfile",isLoggedin,isStudent,isValidUpdate,upload.fields([
    { name: 'conferenceAcceptance', maxCount: 1 },
    { name: 'regFeesProof', maxCount: 1 },
    { name: 'indexingProof', maxCount: 1 }
]) ,editFile);



module.exports = router;
