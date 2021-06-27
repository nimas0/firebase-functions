const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Buyer notified of seller's response to his/her question
module.exports = functions.firestore
  .document('listings/{listingId}/questions/{questionId}')
  .onUpdate(async (change, context) => {
    const previous = change.before.data();
    const updated = change.after.data();

    const {
      internal,
      question,
      userId,
      firstName = null,
      lastName = null,
      email = null,
    } = updated;
    const { listingId } = context.params;

    // do not send email if question was generated internally
    if (internal) return;

    // bail out if response already exists
    if (previous.response && updated.response) return;

    try {
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
      let buyerEmail;

      if (userId) {
        let buyerSnapshot = await admin
          .database()
          .ref(`users/${userId}`)
          .once('value');
        let buyerUser = buyerSnapshot.val() && buyerSnapshot.val();
        buyerName = buyerUser.displayName;
        buyerEmail = buyerUser.email;
      } else {
        buyerName = `${firstName} ${lastName}`;
        buyerEmail = email;
      }

      const compose = await admin
        .firestore()
        .collection('mail')
        .add({
          to: buyerEmail,
          template: {
            name: 'NewQuestionResponse',
            data: {
              buyerDisplayName: buyerName,
              sellerDisplayName: sellerDisplayName,
              question: question,
              listingAddress: listing.fullAddress,
              listingId: listingId,
            },
          },
        });
    } catch (error) {
      functions.logger.log('QUESTIONANSWERED', error);
    }
  });
