const userModel = require("../model/userDetails");
const applicationModal = require("../model/appllication");
const userDetails = require("../model/userDetails");


var html_to_pdf = require('html-pdf-node');
var fs = require('fs');
const path = require("path");
const multer = require("multer");

const dashboard = async (req, res) => {
  try {
    //Coollecting all application
    //but only the few details like [name , date and status]

    const [applications,totalCount, approved , rejected , returned] = await Promise.all([
      applicationModal.find( { departmentInvolved :  req.user.department } , { paperTitle: 1, createdAt: 1, status: 1, hodStatus:1 } ),
      applicationModal.countDocuments(),
      applicationModal.countDocuments({"status.status": "approved"}),
      applicationModal.countDocuments({"status.status": "rejected"}), 
      applicationModal.countDocuments({"status.status": "returned"}),
  ]);
    res.send({
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

    const action2 = action === 'approved' ? 'inprogress' : action;

    const application = await applicationModal.findById(applicationID);

    if (!application) {
      return res.json({
        success: false,
        message: "Application Not Found",
      });
    }

    if (!application.hodStatus.get(req.user.department)) {
      return res.json({
        success: false,
        message: "Department not involved",
      });
    }
    
    if (application.status.status=="inprogress") {
      return res.json({
        success: false,
        message: "You Cant Do anything once it approved",
      });
    }

    if (application.hodStatus.get(req.user.department).status=="inprogress") {
      return res.json({
        success: false,
        message: "Sorry you alredy approved",
      });
    }
    
    application.hodStatus.get(req.user.department).status = action2;
    application.hodStatus.get(req.user.department).msg = msg;

 

    let overallStatus = handleStatus(application, "rejected") ||
                        handleStatus(application, "returned") ||
                        handleStatus(application, "pending") ||
                        handleStatus(application, "inprogress") 

    if (overallStatus) {
      application.status.status = overallStatus;
      application.status.msg = msg;
    } else {
      return res.json({
        success: false,
        message: "Something wrong with status determination",
      });
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

const handleStatus = (application, findingStatus) => {
  for (const [department, hodStatusObj] of application.hodStatus) {
    if (hodStatusObj.get('status') === findingStatus) {
      return findingStatus;
    }
  }
  return null; 
};

module.exports = { dashboard , updateStatus  };


    