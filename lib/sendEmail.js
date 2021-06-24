// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)


/**
 * Send email using send grid api and dynamic templates
 * @param {string} recipient 
 * @param {string} id - template id from sendgrid
 * @param {string} subject 
 * @param {object} data - handlebar data object
 * 
 */

const sendEmail = async (recipient, id, subject, data) => {
  const msg = {
    to: recipient, // Change to your recipient
    from: 'support@findingspaces.com', // Change to your verified sender
    template_id: id,
    dynamicTemplateData: () => {
      let object = data;
      object.subject = subject
      return object;
    }
  }

  try {
    const results = sgMail.send(msg);
    console.log(await results, 'sent!')
  } catch (error) {
    functions.logger.error(error);
  }
 
}




  module.exports.sendEmail = sendEmail;