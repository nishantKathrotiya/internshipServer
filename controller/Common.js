const applicationModal = require("../model/appllication");

var fs = require('fs');
const path = require("path");

const downloadFile = async (req, res) => {
    try {
  
      const { id, title } = req.query;
      if (!id || !title) {
        return res.json({
          success: false,
          message: "Id or Title Not Found",
        });
      }
  
      const form = await applicationModal.findById(id);
      if (!form) {
        return res.json({
          success: false,
          message: "Application Not Found",
        });
      }
  
      let fileName;
  
      switch (title) {
        case 'regFeesProof':
          fileName = form.regFeesProof;
          console.log(fileName)
          break;
        case 'indexingProof':
          fileName = form.indexingProof;
          break;
        case 'conferenceAcceptance':
          fileName = form.conferenceAcceptance;
          break;
        default:
          return res.json({
            success: false,
            message: "Invalid 'title' parameter",
          });
      }
  
      if (!fileName) {
        return res.json({
          success: false,
          message: `File path for '${title}' not found in the database`,
        });
      }
  
     
      // Example file path (replace with your actual file path)
      const userId = String(form.studentDBID);
      const filePath = path.join(__dirname, "../Files", userId,fileName);
  
      // Read the file asynchronously
      fs.readFile(filePath, (err, fileData) => {
        if (err) {
          console.error('Error reading file:', err);
          return res.status(500).json({ error: 'Error reading file' });
        }
  
  
        
        // Set response headers
        res.setHeader('Content-disposition', `attachment; filename=${form.paperTitle}-${title}`);
        res.setHeader('Content-type', 'application/pdf');
  
        // Send both file and JSON in the response
        res.json({
          success:true,
          file: fileData.toString('base64'), // Convert file data to base64 for easier handling in client-side
          name:`${form.paperTitle}-${title}`
        });
      });
  
    } catch (error) {
      console.log(error);
      res.json({
        success: false,
        message: "Something Went Wrong",
      });
    }
  };
  
const viewApplication = async (req, res) => {
    try {
      const { id } = req.query;
      if (!id) {
        return res.json({
          success: false,
          message: "Id Not Found",
        });
      }
  
      
      const form = await applicationModal.findById({_id:id});
  
      if(!form){
        return res.json({
          success: false,
          message: "Application Not Found",
        });
      }

      
      // Example file path (replace with your actual file path)
      const userId = String(form.studentDBID);
      const filePath = path.join(__dirname, "../Files", userId,`${id}.pdf`);
  
      // Read the file asynchronously
      fs.readFile(filePath, (err, fileData) => {
        if (err) {
          console.error('Error reading file:', err);
          return res.status(500).json({ error: 'Error reading file' });
        }
  
  
        // Prepare JSON response data
        const jsonResponse = {
          name:form.paperTitle,
          message: 'File and JSON data fetched successfully',
        };
  
        // Set response headers
        res.setHeader('Content-disposition', `attachment; filename=${jsonResponse.name}`);
        res.setHeader('Content-type', 'application/pdf');
  
        // Send both file and JSON in the response
        res.json({
          success:true,
          file: fileData.toString('base64'), // Convert file data to base64 for easier handling in client-side
          jsonData: jsonResponse,
        });
      });
  
    } catch (error) {
      console.log(error);
      res.json({
        success: false,
        message: "SomeThing Went Wrong",
      });
    }
  };

module.exports = { downloadFile , viewApplication }