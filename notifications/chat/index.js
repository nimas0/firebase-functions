const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.newMessage = functions.database
  .ref('/interest_chat/{interestId}/{pushId}')
  .onCreate(async (snapshot, context) => {
    functions.logger.log('test');
    // Grab the current value of what was written to the Realtime Database.
    const { author, displayName, message } = snapshot.val();
    const { interestId } = context.params;

    const buyerId = interestId.split('_')[1];
    const listingId = interestId.split('_')[0];

    try {
      // Determine if the recipient is online.
      const isRecipientOnline = admin
        .database()
        .ref(`online/${interestId}`)
        .child(buyerId === author ? buyerId : buyerId)
        .get()
        .then((snaphot) => {
          if (snapshot.exists()) {
            console.log(snapshot.val());
            return snapshot.val();
          } else {
            return console.log('No data available');
          }
        });

      console.log(isRecipientOnline);

      const interest = admin.firestore().collection('interest').doc(interestId);
      const groupMessageCounter = admin
        .firestore()
        .collection('message_counter')
        .doc(listingId);
      if (buyerId !== author) {
        functions.logger.log('END MADE IT HERE END');
        //sdfsdf
        // update seller message counter and notify seller
        await interest.update({
          buyerMessageCounter: admin.firestore.FieldValue.increment(1),
        });
        sendSMS('+12702312537', message);
      } else {
        // update seller message counter
        sendSMS('+12702312537', message);
        await interest.update({
          newMessageCount: admin.firestore.FieldValue.increment(1),
        });
        await groupMessageCounter.set(
          { count: admin.firestore.FieldValue.increment(1) },
          { merge: true }
        );
      }
    } catch (error) {
      functions.logger.log('newMessageCounter', error);
    }

    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to the Firebase Realtime Database.
    // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
  });
