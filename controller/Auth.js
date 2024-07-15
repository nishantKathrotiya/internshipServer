const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpModel = require("../model/otp");
const otpGenerator = require("otp-generator");
const userModel = require("../model/userDetails");
const mailSender = require("../transport/mailsender");
const otpTemplate = require("../emailBody/verificatioOtp");
require("dotenv").config();

//signUp
const signUp = async (req, res) => {
  try{
    let {
      firstName,
      lastName,
      sid,
      password,
      confirmPassword,
      otp,
      accountType,
    } = req.body;
    
    console.log(req.body)
    if (
      !firstName||
      !lastName ||
      !sid ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.json({
        success: false,
        msg: "Fill All the Fields",
      });
    }
    sid = sid.toLowerCase();
    const userPresent = await userModel.findOne({ sid: sid });
  
    if (userPresent) {
      return res.json({
        success: false,
        msg: "User Alredy Exist",
      });
    }
  
    const findOtp = await otpModel
    .find( {sid:sid.toLowerCase()} )
    .sort({ createdAt: -1 })
    .limit(1);
  
  
  
    if (findOtp[0].otp !== otp) {
      console.log(otp);
      return res.json({
        success: false,
        msg: "OTP Does not match",
      });
    }
    const hasedPassword = await bcrypt.hash(password, 10);
  
    const registredUser = await userModel.create({
      firstName,
      lastName,
      sid,
      password: hasedPassword,
      role: accountType || "student",
    });
  
    return res.json({
      success: true,
      msg: "User Registred",
    });

  }catch(error){

    console.log(error);
    return res.json({
      success: false,
      message: "Signup Failure, please try again",
    });
    
  }
};

//Login
const login = async (req, res) => {
  try {
    let { sid, password } = req.body; 
    if (!sid || !password) {
      // validate krlo means all inbox are filled or not;
      return res.json({
        success: false,
        message: "Please Fill up All the Required Fields",
      });
    }
    sid = sid.toLowerCase();
  
    const user = await userModel.findOne({ sid: sid }); //user check exist or not
    if (!user) {
      return res.json({
        success: false,
        message: "User is not registrered, please signup first",
      });
    }

    if (await bcrypt.compare(password, user.password)) {
      //generate JWT, after password matching/comparing
      const payload = {
        // generate payload;
        sid: user.sid,
        id: user._id,
        accountType: user.role,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        // generate token (combination of header , payload , signature)
        expiresIn: "72h", // set expiry time; , 
      });
      user.token = token;
      user.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: false,
        sameSite: 'None',
        secure: true,
      };
      res.cookie("token", token, options);
      return res.status(200).json({
        success: true,
        token,
        user,
        message: "Logged in successfully",
      });
    } else {
      return res.json({
        success: false,
        message: "Password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Login Failure, please try again",
    });
  }
};

//sendOTP
const sendOTP = async (req, res) => {
  try {
    let genratedOtp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    let exist = await otpModel.findOne({ otp: genratedOtp });
    while (exist) {
      genratedOtp = otpGenerator.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });
      let exist = await otpModel.findOne({ otp: genratedOtp });
    }

    let response = await otpModel.create({
      otp: genratedOtp,
      sid: req.body.sid.toLowerCase(),
    });

    let res2 = await mailSender(
      req.body.sid.toLowerCase()+'@charusat.edu.in',
      "Verification Code for Charusat Helpdesk",
      otpTemplate(genratedOtp)
    );

    res.json({
      success: true,
      msg: "OTP Sent Successfully",
    });
  } catch {
    res.json({
      success: false,
      msg: "Something Went Wrong",
    });
  }
};

const updateUser = async (req,res) => {
  try {
    const { firstName, lastName } = req.body.userDetails;

    if (!firstName || !lastName) {
    
      return res.json({
        success: false,
        message: "Please Fill up All the Required Fields",
      });
    }

    const user = await userModel.findByIdAndUpdate(req.user._id,{
      $set:{
        firstName:firstName,
        lastName:lastName
      }
    },{new:true} ); 

      user.password = undefined;

      return res.status(200).json({
        success: true,
        user,
      });
    
  } catch (err) {
    res.json({
      success: false,
      msg: "Something Went Wrong",
    });
  }
};

const createAdmin = async (req, res) => {
  try{
    let {
      sid,
      password,
      accountType,
      department,
      email,
    } = req.body;
    
    console.log(req.body)
    if (
      !department ||
      !email ||
      !sid ||
      !password ||
      !accountType
    ) {
      return res.json({
        success: false,
        msg: "Fill All the Fields",
      });
    }
    sid = sid.toLowerCase();
    const userPresent = await userModel.findOne({ sid: sid });
  
    if (userPresent) {
      return res.json({
        success: false,
        msg: "User Alredy Exist",
      });
    }

    const hasedPassword = await bcrypt.hash(password, 10);
  
    const registredUser = await userModel.create({
      department,
      email,
      sid,
      password: hasedPassword,
      role: accountType
    });
  
    return res.json({
      success: true,
      msg: "User Registred",
    });

  }catch(error){

    console.log(error);
    return res.json({
      success: false,
      message: "Signup Failure, please try again",
    });
    
  }
};

module.exports = { signUp, login, sendOTP,updateUser  ,createAdmin };
