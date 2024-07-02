function generateHTML(response) {
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Student Information</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 10px;
          }
          h1 {
            text-align: center;
          }
          .info {
            margin-bottom: 20px;
          }
          .info p {
            margin: 5px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Student Information</h1>
          <div class="info">
            <p><strong>First Name:</strong> ${response.fname}</p>
            <p><strong>Middle Name:</strong> ${response.mname}</p>
            <p><strong>Last Name:</strong> ${response.lname}</p>
            <p>WE are updating application Soon...</p>
          </div>
        </div>
      </body>
      </html>
    `;
}

module.exports = {generateHTML};
