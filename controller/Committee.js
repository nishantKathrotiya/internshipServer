const userModel = require("../model/userDetails");
const applicationModal = require("../model/appllication");
const userDetails = require("../model/userDetails");

var html_to_pdf = require("html-pdf-node");
var fs = require("fs");
const path = require("path");
const multer = require("multer");

const dashboard = async (req, res) => {
  try {
    //Coollecting all application
    //but only the few details like [name , date and status]

    const [applications,totalCount, approved , rejected , returned] = await Promise.all([
      applicationModal.find( { "status.status": { $in: ["inprogress", "approved"] } } , { paperTitle: 1, createdAt: 1, status: 1, committeeStatus:1 } ),
      applicationModal.countDocuments(),
      applicationModal.countDocuments({"status.status": "approved"}),
      applicationModal.countDocuments({"status.status": "rejected"}), 
      applicationModal.countDocuments({"status.status": "returned"}),
  ]);

    return res.send({
      success: true,
      applications,
      counts:{
        totalCount,
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

const updateStatus = async (req, res) => {
  try {
    const { applicationID, action, msg } = req.body;

    if (!applicationID || !action) {
      return res.json({
        success: false,
        message: "Field Missing",
      });
    }

    const application = await applicationModal.findById(applicationID);

    if (!application) {
      return res.json({
        success: false,
        message: "Application Not Found",
      });
    }

    if (application.status=="inprogress") {
      return res.json({
        success: false,
        message: "Still Verification at HOD level Pending",
      });
    }
    
    if (application.status.status=="approved") {
      return res.json({
        success: false,
        message: "You Cant Do anything once it approved",
      });
    }

    if (application.committeeStatus[req.user.sid].status=="approved") {
      return res.json({
        success: false,
        message: "Sorry you alredy approved",
      });
    }
    
    application.committeeStatus[req.user.sid].status = action;
    application.committeeStatus[req.user.sid].msg = msg;

 
    const overallStatus = determineOverallStatus(application);

    if (overallStatus) {
      application.status.status = overallStatus;
      application.status.msg = msg;
    } else {
      return res.json({
        success: false,
        message: "Something wrong with status determination",
      });
    }

    if(!(action=='approved')){
      for (const [department, hodStatusObj] of application.hodStatus) {
        hodStatusObj.status = action
          console.log(application)
      }
    }

    await application.save();

    return res.json({
      success: true,
      message: "Status Updated",
    });

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Something Went Wrong",
    });
  }
};

const determineOverallStatus = (application) => {
  const statuses = Object.values(application.committeeStatus).map(cs => cs.status);
  
  if (statuses.includes("rejected")) {
    return "rejected";
  }
  
  if (statuses.includes("returned")) {
    return "returned";
  }

  if (statuses.includes("inprogress")) {
    return "inprogress";
  }

  if (statuses.every(status => status == "approved")) {
    return "approved";
  }

  return null;
};

module.exports = { dashboard, updateStatus };
