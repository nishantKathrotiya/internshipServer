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

    const [applications,totalCount, approved , rejected , closed] = await Promise.all([
      applicationModal.find( { "status.status": { $in: ["closed", "approved"] } } , { paperTitle: 1, createdAt: 1, status: 1, committeeStatus:1 } ),
      applicationModal.countDocuments(),
      applicationModal.countDocuments({"status.status": "approved"}),
      applicationModal.countDocuments({"status.status": "rejected"}), 
      applicationModal.countDocuments({"status.status": "closed"}),
  ]);

    return res.send({
      success: true,
      applications,
      counts:{
        totalCount,
        approved,
        rejected,
        closed,
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
    const { applicationID, action } = req.body;

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

    if ((application.status.status=="inprogress") || (application.status=="pending")) {
      return res.json({
        success: false,
        message: "Still Verification Pending",
      });
    }
    
    if (application.status.status=="closed") {
      return res.json({
        success: false,
        message: "You Cant Do anything once it approved",
      });
    }

    application.status.status = action;

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

module.exports = { dashboard, updateStatus };
