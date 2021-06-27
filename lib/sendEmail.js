// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const functions = require('firebase-functions')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(functions.config().sendgrid.key);


/**
 * Send email using send grid api and dynamic templates
 * @param {string} recipient 
 * @param {string} id - template id from sendgrid
 * @param {string} subject 
 * @param {object} data - handlebar data object
 * 
 */

const sendEmail = async (recipient, id, data) => {
  const msg = {
    to: recipient, // Change to your recipient
    from: 'support@findingspaces.com', // Change to your verified sender
    template_id: id,
    dynamic_template_data: data
  ,
    
  }

  try {
    const results = sgMail.send(msg);
  } catch (error) {
    functions.logger.error(error);
  }
 
}




  module.exports.sendEmail = sendEmail;