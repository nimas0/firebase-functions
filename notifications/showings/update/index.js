const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();
const findDiff = require('../../../helpers').findDiff
const { sendEmail } = require('../../../lib/sendEmail');



const showingsUpdated = functions.firestore
.document('showings/{showingId}')
.onUpdate(async (change, context) => {
    const previous = change.before.data();
    const updated = change.after.data();

   // destructure updated values
    const {
      buyerUser,
      listingId,
      cancelReason = null,
    } = updated;

   // grab listing Address
   const listingRef = admin.firestore().collection('listings');
   const listing = (await listingRef.doc(listingId).get()).data();

   console.log("HERELISTING", listing)
   // grab seller email
   let sellerSnapshot = await admin
   .database()
   .ref(`users/${listing.primaryOwnerId}`)
   .once('value');
   let sellerUser = sellerSnapshot.val() && sellerSnapshot.val();
   console.log("HERE", sellerUser)
   const sellerEmail = sellerUser.email;
   const sellerDisplayName = sellerUser.displayName;


   // figure out what changed between previous and updated state 
   const difference = findDiff(previous, updated);
   const isStatus = difference[0].key === 'status';
   const statusValue = isStatus && difference[0].update;

   try {
   // bail out if not a status update
   if (!status) return null;

   switch (statusValue) {
      case 'approved':
         sendEmail(buyerUser.email, "id", "Showing Approved", {
            buyerDisplayName: buyerUser.displayName,
            listingAddress: listing.fullAddress,
         });
         break;
      case 'declined':
         sendEmail(buyerUser.email, "id", "Showing Declined", {
            buyerDisplayName: buyerUser.displayName,
            listingAddress: listing.fullAddress,
            cancelReason: cancelReason,
         });
         break;
      case 'cancelled':
         // both parties recieve cancellation
         // this way you don't need to track which party was responsible
         // for cancelling. 
         sendEmail(buyerUser.email, "id", "Showing Cancelled", {
            buyerDisplayName: buyerUser.displayName,
            listingAddress: listing.fullAddress,
            cancelReason: cancelReason,
         });
         sendEmail(sellerEmail, "id", "Showing Cancelled", {
            buyerDisplayName: sellerDisplayName,
            listingAddress: listing.fullAddress,
            cancelReason: cancelReason,
         });
         break;
      default:
         throw new Error('Status was updated with an incorrect value')
   }
   // firebase functions should process one update at a time.
   // there should never be two updates in any one request
   if (difference.length > 1) throw new Error('There were multiple updates to this file. System can only handle one per request.')
   return null;



   } catch (error) {
      functions.logger.error('showings-updates', error);
      functions.logger.error('find diff', difference);
   }

})


module.exports.showingsUpdated = showingsUpdated;