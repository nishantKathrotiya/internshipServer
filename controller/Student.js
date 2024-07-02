const userModel = require("../model/userDetails");
const applicationModal = require("../model/appllication");
const userDetails = require("../model/userDetails");


var html_to_pdf = require('html-pdf-node');
const {generateHTML} = require("../emailBody/application");
var fs = require('fs');
const path = require("path");
const multer = require("multer");

const newApplication = async (req, res) => {
  try {
    const {
      fname,
      mname,
      lname,
      studentID,
      mobileNumber,
      department,
      pgUg,
      institute,
      attendance,
      paperTitle,
      publisherDetail,
      conferenceName,
      conferenceWebsite,
      regFees,
      indexing,
      firstAuthor,
      authorFullName,
      authorRollNo,
      facultyCoAuthors,
      coAuthors,
    } = req.body;

    var departmentInvolved =[];
    departmentInvolved.push(`${institute[0]}${department}`);
  
    JSON.parse(coAuthors).forEach((student)=>{
      if(departmentInvolved.indexOf(`${student.studentInstitute[0]}${student.studentDepartment}`)==-1){
        departmentInvolved.push(`${student.studentInstitute[0]}${student.studentDepartment}`)
      }
    });

    JSON.parse(facultyCoAuthors).forEach((faculty)=>{
      if(departmentInvolved.indexOf(`${faculty.facultyInstitute[0]}${faculty.facultyCoAuthorDepartment}`)==-1){
        departmentInvolved.push(`${faculty.facultyInstitute[0]}${faculty.facultyCoAuthorDepartment}`)
      }
    });

    var hodStatus = {};
     departmentInvolved.forEach((department)=> {
      hodStatus[`${department}`] = {
        status:'pending',
        nsg:null
      }
    } );

    //new entry data at collection
    const response = await applicationModal.create({
      fname,
      mname,
      lname,
      studentID,
      studentDBID: req.user._id,
      mobileNumber,
      department,
      pgUg,
      institute,
      attendance,
      coAuthors :JSON.parse(coAuthors) ,
      paperTitle,
      publisherDetail,
      conferenceName,
      conferenceWebsite,
      regFees,
      indexing,
      firstAuthor,
      authorFullName: firstAuthor == "Yes" ? null : authorRollNo,
      authorRollNo: firstAuthor == "Yes" ? null : authorFullName,
      facultyCoAuthors:JSON.parse(facultyCoAuthors),
      conferenceAcceptance: req.files.conferenceAcceptance[0].filename,
      regFeesProof: req.files.regFeesProof[0].filename,
      indexingProof: req.files.indexingProof[0].filename,
      status: {
        status: "pending",
        msg: null,
      },
      departmentInvolved,
      hodStatus
    });

    //Upadting user and adding the application id to user
    const updatedUser = await userModel.findByIdAndUpdate(req.user._id, {
      $push: {
        applications: response._id,
      },
    },{new:true});

    const html = generateHTML(response)
    let options = { format: "A4" };
    const pdfBuffer = await html_to_pdf.generatePdf({ content: html }, options);

    const userId = String(req.user._id);
    const filePath = path.join(__dirname, "../Files", userId);

    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath);
    }

    const pdfFileName = `${response._id}.pdf`;
    fs.writeFileSync(path.join(filePath, pdfFileName), pdfBuffer);

    //Sending the response
    res.json({
      success: true,
      answer: response,
      message: "Application Submitted",
    });
  } catch (err) {
    console.log(err)
    res.json({
      success: false,
      message: "SomeThing Went Wrong",
    });
  }
};

const dashboard = async (req, res) => {
  try {
    //Collecting ids of application from user Collection
    const applicationIDS = await userDetails.findOne(req.user._id, {
      applications: 1,
    });
    const ids = applicationIDS.applications;

    //passing all the application ids to find all the application
    //but only the few details like [name , date and status]


    const [applications,totalCount, approved , rejected , returned] = await Promise.all([
      applicationModal.find({ _id: { $in: ids } },{ paperTitle: 1, createdAt: 1, status: 1 } ),
      applicationModal.countDocuments(),
      applicationModal.countDocuments({"status.status": "approved"}),
      applicationModal.countDocuments({"status.status": "rejected"}), 
      applicationModal.countDocuments({"status.status": "returned"}),
  ]);

    return res.send({
      success: true,
      applications,
      counts:{
        totalCount:applications.length,
        approved,
        rejected,
        returned,
      }
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "SomeThing Went Wrong",
    });
  }
};

const editInitialData = async (req, res) => {
  try {
    const {applicationID} = req.query;

    if (!applicationID) {
      return res.json({
        success: false,
        message: "ApplicationID Not Found",
      });
    }

    const options = {
      hodStatus: 0,
      status: 0,
      committeeStatus: 0,
      departmentInvolved: 0,
      _id: 0,
      studentDBID:0,
      createdAt: 0,
      conferenceAcceptance: 0,
      regFeesProof: 0,
      indexingProof: 0,
      __v: 0,
    };
    const applications = await applicationModal.findById({ _id: applicationID},options);

    res.send({
      success: true,
      applications,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "SomeThing Went Wrong",
    });
  }
};

const updateApplication = async (req, res) => {
  try {

    const {applicationID} = req.body;
    const {
      fname,
      mname,
      lname,
      studentID,
      mobileNumber,
      department,
      pgUg,
      institute,
      attendance,
      paperTitle,
      publisherDetail,
      conferenceName,
      conferenceWebsite,
      regFees,
      indexing,
      firstAuthor,
      authorFullName,
      authorRollNo,
      facultyCoAuthors,
      coAuthors,
    } = req.body.formData;

    if (!applicationID) {
      return res.json({
        success: false,
        message: "ApplicationID Not Found",
      });
    }
    var departmentInvolved =[];
    departmentInvolved.push(`${institute[0]}${department}`);
  
    coAuthors.forEach((student)=>{
      if(departmentInvolved.indexOf(`${student.studentInstitute[0]}${student.studentDepartment}`)==-1){
        departmentInvolved.push(`${student.studentInstitute[0]}${student.studentDepartment}`)
      }
    });

    facultyCoAuthors.forEach((faculty)=>{
      if(departmentInvolved.indexOf(`${faculty.facultyInstitute[0]}${faculty.facultyCoAuthorDepartment}`)==-1){
        departmentInvolved.push(`${faculty.facultyInstitute[0]}${faculty.facultyCoAuthorDepartment}`)
      }
    });

    var hodStatus = {};
     departmentInvolved.forEach((department)=> {
      hodStatus[`${department}`] = {
        status:'pending',
        nsg:null
      }
    } );

    
   
    const response = await applicationModal.findByIdAndUpdate({_id:applicationID},{
      fname,
      mname,
      lname,
      studentID,
      mobileNumber,
      department,
      pgUg,
      institute,
      attendance,
      coAuthors ,
      paperTitle,
      publisherDetail,
      conferenceName,
      conferenceWebsite,
      regFees,
      indexing,
      firstAuthor,
      authorFullName: firstAuthor == "Yes" ? null : authorRollNo,
      authorRollNo: firstAuthor == "Yes" ? null : authorFullName,
      facultyCoAuthors,
      status: {
        status: "pending",
        msg: null,
      },
      departmentInvolved,
      hodStatus,
      committeeStatus: {
        committee1: {
          status: 'inprogress', msg: '' ,
        },
        committee2: {
          status: 'inprogress', msg: '' ,
        },
        committee3: {
          status: 'inprogress', msg: '' ,
        }
      },
    });

    

    const html = generateHTML(response)
    let options = { format: "A4" };
    const pdfBuffer = await html_to_pdf.generatePdf({ content: html }, options);

    const userId = String(req.user._id);
    const filePath = path.join(__dirname, "../Files", userId);

    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath);
    }

    const pdfFileName = `${response._id}.pdf`;
    fs.writeFileSync(path.join(filePath, pdfFileName), pdfBuffer);

    return res.send({
      success: true,
      msg:"Updated",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "SomeThing Went Wrong",
    });
  }
};

const editFile = async (req, res) => {
  try {
   const {applicationID} = req.query;

    if (!applicationID) {
      return res.json({
        success: false,
        message: "ApplicationID Not Found",
      });
    }

    const options ={
      status: 1,
      hodStatus: 1,
      studentDBID:1,
      regFeesProof: 1,
      indexingProof: 1,
      committeeStatus: 1,
      departmentInvolved:1,
      conferenceAcceptance: 1,
  };
  const applications = await applicationModal.findById({ _id: applicationID},options);

  var upadtedHodStatus = {};
  applications.departmentInvolved.forEach((department)=> {
    upadtedHodStatus[`${department}`] = {
    status:'pending',
     msg:null
   }
 } );

        const userId = String(applications.studentDBID);
        
        const filePath1 = path.join(__dirname, "../Files", userId,applications.regFeesProof);
        const filePath2 = path.join(__dirname, "../Files", userId,applications.indexingProof);
        const filePath3 = path.join(__dirname, "../Files", userId,applications.conferenceAcceptance);

        try{
          fs.unlinkSync(filePath1);
          fs.unlinkSync(filePath2);
          fs.unlinkSync(filePath3);
        }catch(err){
          console.log("Went Wrong While File Delete")
        }

    applications. regFeesProof = req.files.regFeesProof[0].filename;
    applications. indexingProof = req.files.indexingProof[0].filename;
    applications. conferenceAcceptance = req.files.conferenceAcceptance[0].filename;
    applications.hodStatus = upadtedHodStatus;
    applications. committeeStatus =  {
          committee1: {
            status: 'inprogress', msg: '' ,
          },
          committee2: {
            status: 'inprogress', msg: '' ,
          },
          committee3: {
            status: 'inprogress', msg: '' ,
          }
    },
    applications.save();

    //Sending the response
    res.json({
      success: true,
      message: "Application Submitted",
    });

  } catch (err) {
    console.log(err)
    res.json({
      success: false,
      message: "SomeThing Went Wrong",
    });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const {applicationID} = req.query;

    if (!applicationID) {
      return res.json({
        success: false,
        message: "ApplicationID Not Found",
      });
    }

    const applications = await applicationModal.findByIdAndDelete({ _id: applicationID});

    res.send({
      success: true,
      msg:"deleted",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "SomeThing Went Wrong",
    });
  }
};

module.exports = { newApplication,dashboard,editInitialData,updateApplication,editFile,deleteApplication};
