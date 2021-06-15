const functions = require('firebase-functions');
const admin = require('firebase-admin');
const shortid = require('shortid');

const twilio = require('twilio');
const accountSid = functions.config().twilio.sid
const authToken = functions.config().twilio.token

const client = new twilio(accountSid, authToken);

const twilioNumber = '+12569078856' // twilio phone number


exports.textStatus = functions.firestore
    .document('interest/{interestId}')
    .onUpdate((change, context) => {

        const previous = change.before.data();

        const updated = change.after.data();

        // bail out if there is no proposal created
        if (!updated.proposal) return null;

        // compare ids
        let prevDocId = previous.proposal.latestQuickFacts.docId;
        let updatedDocId = updated.proposal.latestQuickFacts.docId;

        // if docIds did not change, then we know a new offer has not been submitted
        // therefor we should bail out of this functions
        if (prevDocId === updatedDocId) return null;
        // create id for sms_noreply collection
        // send to callback to generate delivery status
        const docSmsId = shortid.generate();
        return admin.firestore()
            .collection('interest').doc(context.params.interestId)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    const phoneNumber = '12702312537'

                    if (!validE164(phoneNumber)) {
                        throw new Error('number must be E164 format!')
                    }

                    const textMessage = {
                        body: `What's good with you mane`,
                        to: phoneNumber,  // Text to this number
                        from: twilioNumber, // From a valid Twilio number,
                        statusCallback: `https://us-central1-finding-spaces-73b23.cloudfunctions.net/callback-callback?smsId=${docSmsId}`,
                    }

                    return client.messages.create(textMessage)
                } else {
                    return functions.logger.log('No such document exists')
                }


            }).then(message => {
                functions.logger.log(message, 'success')
                return admin.firestore().collection('sms_noreply').doc(docSmsId).set({ data: JSON.parse(JSON.stringify(message)) })

            })
            .then((results) => admin.firestore().collection('mail').add({
                to: 'nick@beyondsocial.io',
                message: {
                    subject: 'Hello from Firebase!',
                    text: 'This is the plaintext section of the email body.',
                    html: 'This is the <code>HTML</code> section of the email body.',
                }
            })).then(() => console.log('Queued email for delivery!'))
            .catch(err => console.log(err))
    })







/// Validate E164 format
function validE164(num) {
    return /^\+?[1-9]\d{1,14}$/.test(num)
}