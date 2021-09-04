const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { sendEmail, sendTextEmail } = require("../../lib/sendEmail");

// Welcome email to any new user that signs up regardless of customer type
module.exports = functions.auth.user().onCreate(async (user) => {
  const { email, displayName } = user;

  try {
    sendEmail(email, "d-fd270280ed414c0e8816ad46741ba2ee", {
      name: displayName,
    });

    // alert admin of new user
    sendTextEmail(
      "support@findingspaces.com",
      `A new user signed up. ${user}`,
      "New User Alert"
    );

    functions.logger.log("NEWUSEREMAIL", displayName);
  } catch (error) {
    functions.logger.log(error.response.body);
  }
});
