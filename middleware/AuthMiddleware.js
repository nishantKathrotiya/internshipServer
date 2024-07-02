const jwt = require("jsonwebtoken");
const userModel = require("../model/userDetails");
const applicationModal = require("../model/appllication")
require("dotenv").config();

exports.isLoggedin = async (req, res ,next) => {
  try {
    
    if (!req.cookies.token) {
      return res.json({
        success: false,
        message: "Token Not Found",
      });
    }
    
    const user = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
   
    const userAtDb = await userModel.findOne({ sid: user.sid });
    
    if (!userAtDb) {
      return res.json({
        success: false,
        message: "Invalid User",
      });
    }

    userAtDb.password = undefined;
    req.user = userAtDb;
    
    next();
  } catch (error) {
    
    return res.json({
      success: false,
      message: "error while checking Token",
    });
  }
};

exports.isStudent = async (req, res,next) => {
  try {
    if (req.user.role !== "student") {
      return res.send({
        success: false,
        message: "You are not User",
      });
    }

    next();
  } catch (error) {
    console.log(error)
    return res.json({
      success: false,
      message: "error while Verifying User",
    });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.send({
        success: false,
        message: "You are not admin",
      });
    }
    console.log("Passed Is admin")
    next();
  } catch (error) {
    return res.json({
      success: false,
      message: "error while Verifying admin",
    });
  }
};

exports.isHod = async (req,res,next) => {
  try {
    if (req.user.role !== "hod") {
      return res.send({
        success: false,
        message: "You are not admin",
      });
    }
    console.log("Passed Is admin")
    next();
  } catch (error) {
    return res.json({
      success: false,
      message: "error while Verifying admin",
    });
  }
}

exports.isCommittee = async (req,res,next) => {
  try {
    if (req.user.role !== "committee") {
      return res.send({
        success: false,
        message: "You are not admin",
      });
    }
    console.log("Passed Is admin")
    next();
  } catch (error) {
    return res.json({
      success: false,
      message: "error while Verifying admin",
    });
  }
}
