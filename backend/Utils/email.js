const nodemailer = require('nodemailer');
const { google } = require('googleapis');

// OAuth2 client setup
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN
});

// Async function to get the access token
async function getAccessToken(oauth2Client) {
  const { token } = await oauth2Client.getAccessToken();
  return token;
}

// Async function to create a nodemailer transport
async function createTransporter() {
  const accessToken = await getAccessToken(oauth2Client);
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'FicbattlesHelper@gmail.com',
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken
    },
  });
  return transporter;
}

// Function to send email
async function sendEmail(to, subject, htmlContent) {
  const transporter = await createTransporter();
  const mailOptions = {
    from: 'FicBattle@support.com',
    to: to,
    subject: subject,
    html: htmlContent
  };

  return transporter.sendMail(mailOptions);
}


module.exports = sendEmail;
