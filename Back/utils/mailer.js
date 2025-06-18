// mailer.js
const nodemailer = require("nodemailer");

const sendEmail = async ({ to, project, user, token }) => {
  const acceptURL = `http://localhost:5173/transferconfirmation/${token}`;

  try {
    // Create reusable transporter object using Gmail SMTP
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use an app password, not your actual Gmail password
      },
    });
    const emailHtml = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>WebCraft Project Transfer</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: 'Segoe UI', sans-serif;
        background: linear-gradient(135deg, #8e44ad, #6dd5fa);
        color: #ffffff;
        width: 100%;
      }

      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #1c1c2b;
        padding: 40px 30px;
        border-radius: 16px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
        color: #fff;
      }

      h1 {
        font-size: 26px;
        margin-bottom: 16px;
        color: #ffffff;
      }

      p {
        font-size: 16px;
        line-height: 1.6;
        margin-bottom: 18px;
        color: #d1d1d1;
      }

      .highlight {
        color: #7ce3ff;
        font-weight: 600;
      }

      .button-container {
        margin-top: 30px;
        text-align: center;
      }

      .accept-button {
        background-color: #00d2ff;
        color: #000;
        padding: 14px 32px;
        text-decoration: none;
        border-radius: 8px;
        font-weight: bold;
        font-size: 16px;
        display: inline-block;
        transition: background 0.3s;
      }

      .accept-button:hover {
        background-color: #00b0d0;
      }

      .project-info {
        background-color: #2a2a3f;
        padding: 20px;
        border-radius: 10px;
        margin-bottom: 24px;
      }

      .footer {
        margin-top: 40px;
        font-size: 13px;
        text-align: center;
        color: #aaaaaa;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Hello ${user.name},</h1>
      <p>
        You've been invited to take ownership of the project <span class="highlight">"${project.title}"</span> on <strong>WebCraft</strong>.
      </p>
        <p>
          Alert !
            This session will be invalidated after 2 days
         </p>
      <div class="project-info">
        <p><strong>Title:</strong> ${project.title}</p>
        <p><strong>Description:</strong> ${project.description}</p>
        <p><strong>Initiated by:</strong> ${user.name}</p>
      </div>

      <p>
        By accepting this transfer, you will gain full control over the project, including editing, publishing, and collaboration rights.
      </p>

      <div class="button-container">
        <a href="${acceptURL}" class="accept-button">Go to Transfer Page</a>
      </div>

      <div class="footer">
        If you did not expect this email, you can safely ignore it.<br />
        — WebCraft Team
      </div>
    </div>
  </body>
</html>
`;

    // Define email options
    let mailOptions = {
      from: "webcraft@official.com",
      to: to,
      subject: `Transfer request of prooject named ${project.title} `,
      html: emailHtml,
    };

    // Send email
    let info = await transporter.sendMail(mailOptions);
    // console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = sendEmail;
