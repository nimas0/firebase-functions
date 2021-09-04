// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const functions = require("firebase-functions");
const apiKey = "433e932d573e96c55976d1f6f4585dfb";
const oauthToken =
  "821122bfe0d29e117f6432437d065402d3e190084cae34704ad64e3ec46593a1";
var trelloNode = require("trello-node-api")(apiKey, oauthToken);
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(functions.config().sendgrid.key);

/**
 * Send email using send grid api and dynamic templates
 * @param {string} recipient
 * @param {string} id - template id from sendgrid
 * @param {string} subject
 * @param {object} data - handlebar data object
 *
 */

const sendTextEmail = async (recipient, message, subject) => {
  const msg = {
    to: recipient,
    from: "support@findingspaces.com",
    subject: subject,
    text: message,
  };

  try {
    const results = sgMail.send(msg);
  } catch (error) {
    functions.logger.error(error);
  }
};

const sendEmail = async (recipient, id, data) => {
  const msg = {
    to: recipient, // Change to your recipient
    from: "support@findingspaces.com", // Change to your verified sender
    template_id: id,
    dynamic_template_data: data,
  };

  try {
    const results = sgMail.send(msg);
  } catch (error) {
    functions.logger.error(error);
  }
};

module.exports.sendEmail = sendEmail;
module.exports.sendTextEmail = sendTextEmail;
