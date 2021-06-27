const functions = require('firebase-functions');
const admin = require('firebase-admin');


// Seller notified about a new question that needs to be answered
module.exports = functions.firestore
  .document('listings/{listingId}/questions/{questionId}')
  .onCreate(async (snap, context) => {
    // if self generated, then bail out
    // if anon, handle no user data

    // extract data from snap
    const {
      internal,
      question,
      userId,
      firstName = null,
      lastName = null,
      email = null,
    } = snap.data();
    const { listingId } = context.params;

    try {
      // do not send email if question was generated internally
      if (internal) return;
      // Bring in primary user email tied to listing
      const listingRef = admin.firestore().collection('listings');
      const listing = (await listingRef.doc(listingId).get()).data();

      let sellerSnapshot = await admin
        .database()
        .ref(`users/${listing.primaryOwnerId}`)
        .once('value');
      let sellerUser = sellerSnapshot.val() && sellerSnapshot.val();
      const sellerEmail = sellerUser.email;
      const sellerDisplayName = sellerUser.displayName;

      let buyerName;

      if (userId) {
        let buyerSnapshot = await admin
          .database()
          .ref(`users/${userId}`)
          .once('value');
        let buyerDisplayName =
          buyerSnapshot.val() && buyerSnapshot.val().displayName;
        buyerName = buyerDisplayName;
      } else {
        buyerName = `${firstName} ${lastName}`;
      }

      const compose = await admin
        .firestore()
        .collection('mail')
        .add({
          to: sellerEmail,
          template: {
            name: 'NewQuestion',
            data: {
              sellerDisplayName: sellerDisplayName,
              question: question,
              displayName: buyerName,
            },
          },
        });

      functions.logger.log('buyerName', buyerName);
      functions.logger.log('question', question);
      functions.logger.log('question', sellerEmail);
    } catch (error) {
      functions.logger.log(error);
    }
  });