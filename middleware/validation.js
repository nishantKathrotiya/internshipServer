const applicationModal = require("../model/appllication")

exports.isValidForm = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    res.json({
      success: false,
      message: "File Upload Fails",
    });
  }

  const validation = () => {
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

    // Check if any of the fields are empty or null
    const isEmpty = (value) =>
      value === "" || value === null || value === undefined;

    // Validate each field
    const isFormValid =
      !isEmpty(fname) &&
      !isEmpty(mname) &&
      !isEmpty(lname) &&
      !isEmpty(studentID) &&
      !isEmpty(mobileNumber) &&
      !isEmpty(department) &&
      !isEmpty(pgUg) &&
      !isEmpty(institute) &&
      !isEmpty(attendance) &&
      !isEmpty(paperTitle) &&
      !isEmpty(publisherDetail) &&
      !isEmpty(conferenceName) &&
      !isEmpty(conferenceWebsite) &&
      !isEmpty(regFees) &&
      !isEmpty(indexing) &&
      (firstAuthor === "Yes" || (!isEmpty(authorFullName) && !isEmpty(authorRollNo))) &&
      JSON.parse(coAuthors).every(coAuthor => (
        !isEmpty(coAuthor.studentName) &&
        !isEmpty(coAuthor.studentID) &&
        !isEmpty(coAuthor.studentDepartment) &&
        !isEmpty(coAuthor.studentPGUG) &&
        !isEmpty(coAuthor.studentInstitute) &&
        !isEmpty(coAuthor.studentAttendace)
      )) &&

      JSON.parse(facultyCoAuthors).every(facultyCoAuthor => (
        !isEmpty(facultyCoAuthor.facultyCoAuthorName) &&
        !isEmpty(facultyCoAuthor.facultyCoAuthorDepartment) &&
        !isEmpty(facultyCoAuthor.facultyInstitute)
      ))

    return !isFormValid;
  };

  try {
    if (validation()) {
      return res.json({
        success: false,
        message: "All Field Required",
      });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      msg: "error while checking Data",
    });
  }
};

exports.isValidUpdateForm = async (req, res, next) => {
  

  const validation = () => {
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

    // Check if any of the fields are empty or null
    const isEmpty = (value) =>
      value === "" || value === null || value === undefined;

    // Validate each field
    const isFormValid =
      !isEmpty(fname) &&
      !isEmpty(mname) &&
      !isEmpty(lname) &&
      !isEmpty(studentID) &&
      !isEmpty(mobileNumber) &&
      !isEmpty(department) &&
      !isEmpty(pgUg) &&
      !isEmpty(institute) &&
      !isEmpty(attendance) &&
      !isEmpty(paperTitle) &&
      !isEmpty(publisherDetail) &&
      !isEmpty(conferenceName) &&
      !isEmpty(conferenceWebsite) &&
      !isEmpty(regFees) &&
      !isEmpty(indexing) &&
      (firstAuthor === "Yes" || (!isEmpty(authorFullName) && !isEmpty(authorRollNo))) &&
      coAuthors.every(coAuthor => (
        !isEmpty(coAuthor.studentName) &&
        !isEmpty(coAuthor.studentID) &&
        !isEmpty(coAuthor.studentDepartment) &&
        !isEmpty(coAuthor.studentPGUG) &&
        !isEmpty(coAuthor.studentInstitute) &&
        !isEmpty(coAuthor.studentAttendace)
      )) &&

      facultyCoAuthors.every(facultyCoAuthor => (
        !isEmpty(facultyCoAuthor.facultyCoAuthorName) &&
        !isEmpty(facultyCoAuthor.facultyCoAuthorDepartment) &&
        !isEmpty(facultyCoAuthor.facultyInstitute)
      ))

    return !isFormValid;
  };

  try {
    if (validation()) {
      return res.json({
        success: false,
        message: "All Field Required",
      });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      msg: "error while checking Data",
    });
  }
};

exports.isValidUpdate = async (req,res,next) => {
  try {
    
    const {applicationID}  = req.query ;
    if(!applicationID){
      return res.json({
        success: false,
        message: "Application ID not Found",
      });
    }
    const data = await applicationModal.findById({_id:applicationID});
    if(!data){
      return res.json({
        success: false,
        message: "Application  not Found",
      });
    }

    if(!(data.status.status=="pending" || data.status.status=="returned")){
      return res.json({
        success: false,
        message: "Application Can't be Edit Anymore",
      });
    }

    console.log("Passed Is admin")
    next();
  } catch (error) {
    return res.json({
      success: false,
      message: "error while Verifying Application",
    });
  }
}
