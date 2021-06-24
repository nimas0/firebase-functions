const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firebase_tools = require('firebase-tools')


// Seller notified of a new showing
exports.resetdb = functions.firestore
.document('private/{rdb}')
.onUpdate(async (change, context) => {
    const previous = change.before.data();
    const updated = change.after.data();
    

    // bail out if this was generated as an example for a new listing
    if (process.env.NODE_ENV !== 'localhost') return;

    try {
      // get seller display name
      // get seller email
      // get listing Address

      await firebase_tools.firestore
      .delete("mail", {
        project: process.env.GCLOUD_PROJECT,
        recursive: true,
        yes: true,
        token: functions.config().fb.token
      });

    } catch (error) {
      functions.logger.log('showingrequestnew', error);
    }
  });