const functions = require('firebase-functions');
const admin = require('firebase-admin');


// Seller notified about his/her new lead
module.exports = functions.firestore
  .document('interest/{interstId}')
  .onCreate(async (snap, context) => {
    const { buyer, feedback = null, listingId, isExample } = snap.data();

    // bail out if this was generated as an example for a new listing
    if (isExample) return;

    try {
      // get seller display name
      // get seller email
      // get listing Address

      const listingRef = admin.firestore().collection('listings');
      const listing = (await listingRef.doc(listingId).get()).data();

      let sellerSnapshot = await admin
        .database()
        .ref(`users/${listing.primaryOwnerId}`)
        .once('value');
      let sellerUser = sellerSnapshot.val() && sellerSnapshot.val();
      const sellerEmail = sellerUser.email;
      const sellerDisplayName = sellerUser.displayName;

      const compose = await admin
        .firestore()
        .collection('mail')
        .add({
          to: sellerEmail,
          template: {
            name: 'NewLead',
            data: {
              buyerDisplayName: buyer.displayName,
              listingAddress: listing.fullAddress,
              feedback: feedback,
            },
          },
        });
    } catch (error) {
      functions.logger.log('newlead', error);
    }
  });
