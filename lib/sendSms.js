const functions = require('firebase-functions');
const accountSid = functions.config().twilio.sid;
const authToken = functions.config().twilio.token;
const client = require('twilio')(accountSid, authToken);

/**
 * Send message through twilio api
 * @param {string} phoneNumber
 * @param {string} body
 * @returns message object
 */

const sendSMS = async (phoneNumber, body) => {
  try {
    const message = await client.messages.create({
      body: body,
      messagingServiceSid: 'MG55522755eabee597b6fdeaa888ffe311',
      to: phoneNumber,
    });

    functions.logger.log(message);

    return message;
  } catch (error) {
    functions.logger.log(error);
    return error;
  }
};

module.exports.sendSMS = sendSMS;
