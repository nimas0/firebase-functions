const functions = require('firebase-functions');
const admin = require('firebase-admin');
/* 

Webhook for taking in callback data on Twilio SMS status
After a sms has been successfully sent or failed, 
this webhook will update the database accordingly

TODO: If errors, add to adminTasks alerts 
TODO: Did i write the res.send correctly?
*/


exports.callback = functions.https.onRequest(async (req, res) => {
    const smsRef = admin.firestore().collection('sms_noreply');

    try {
        const snapshot = await smsRef.where('data.sid', '==', req.body.SmsSid).get();
        // stop callback if snapshot has no data
        if (snapshot.empty) {
            functions.logger.log('No matching documents.');
            return;
        }
        // add callback data to 
        snapshot.forEach(async doc => {
            const sms = doc.data();
            functions.logger.log('smsItem', '=>', sms);
            await admin.firestore().collection('sms_noreply').doc(doc.id).update({
                deliver: {
                    ...req.body
                }
            })
        });
        res.status(200).json({ message: 'Processed Successfuly' })
    } catch (error) {
        functions.logger.log('[ERROR]', error);
        res.status(500).json({ message: error });

    }



})
