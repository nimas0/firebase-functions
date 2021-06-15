'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');

const twilio = require('twilio');
const accountSid = functions.config().twilio.sid
const authToken = functions.config().twilio.token
const client = new twilio(accountSid, authToken);
const twilioNumber = functions.config().twilio.phonenumber

/** 
 * Detects new entries in firestore collection sms_noreply 
 * and pushes them to the twilio api for delivery
 * 
 * @typedef {Object} snap.data() - Data from firestore
 * @property {string} body - Body of text that will be sent to twilio
 * @property {string} phoneNumber - Must be valid E164 format
 * @property {string} userId - optional
 * @property {string} listingId - optional
 * 
*/


// Webhook api url for twilio to send and update delivery status
const callbackUrl = `https://us-central1-finding-spaces-73b23.cloudfunctions.net/callback-callback`

exports.textStatus = functions.firestore
    .document('sms_noreply/{docId}')
    .onCreate((snap, context) => {
        //TODO: require this information on when data entry is made via securty rules
        // if listingId, userId, index are missing text will still send. This is an issue
        const { body, listingId = null, userId = null, phoneNumber } = snap.data();
        const docId = context.params.docId;


        if (!validE164(phoneNumber)) {
            throw new Error('number must be E164 format!')
        }

        const textMessage = {
            body: body,
            to: phoneNumber,  // Text to this number
            from: twilioNumber, // From a valid Twilio number,
            statusCallback: 'https://us-central1-finding-spaces-73b23.cloudfunctions.net/callback-callback'
        }
        // when promise resolves add results into sms_noreply collection under {data} map
        return client.messages.create(textMessage)
            .then(message => {
                functions.logger.log(message)
                return admin.firestore().collection('sms_noreply').doc(docId).update({ data: JSON.parse(JSON.stringify(message)), listingId, userId })

            })
            .catch(err => functions.logger.log(err))

    })


/// Validate E164 format
function validE164(num) {
    return /^\+?[1-9]\d{1,14}$/.test(num)
}