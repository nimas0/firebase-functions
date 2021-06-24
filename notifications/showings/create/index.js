const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { sendEmail } = require('../../../lib/sendEmail');


// Seller notified of a new showing
exports.sendShowingRequestNew = functions.firestore
  .document('showings/{showingId}')
  .onCreate(async (snap, context) => {
    const {
      buyerUser,
      listingId,
      scheduled,
      isExample,
    } = snap.data();

    // bail out if this was generated as an example for a new listing
    if (isExample) return;


    try {

      // get listing Address
      const listingRef = admin.firestore().collection('listings');
      const listing = (await listingRef.doc(listingId).get()).data();


      // get seller Email and display name
      let sellerSnapshot = await admin
        .database()
        .ref(`users/${listing.primaryOwnerId}`)
        .once('value');
      let sellerUser = sellerSnapshot.val() && sellerSnapshot.val();
      const sellerEmail = sellerUser.email;
      const sellerDisplayName = sellerUser.displayName;



      sendEmail(
        sellerEmail,
        "d-619ecacba28545f6b145402668997bcc",
        "New Showing Request",
        {
          buyerDisplayName: buyerUser.displayName,
          sellerDisplayName: sellerDisplayName,
          scheduledTime: new Date(
            scheduled.seconds * 1000
          ).toLocaleString(),
          listingAddress: listing.fullAddress,
        }
      )

  
    } catch (error) {
      functions.logger.log('showingrequestnew', error);
    }
  });