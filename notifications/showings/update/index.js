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

   // Figure out what changed between previous and updated state 
   const difference = findDiff(previous, updated);
   const isStatus = difference[0].key === 'status';
   const statusValue = isStatus && difference[0].update;

   try {
   // bail out if not a status update
   if (!status) return null;

   // who submitted this status change? the buyer or seller?
   const recipent = statusHistory[0] === buyerUser ? buyerUser.email : "seller"

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
         sendEmail(buyerUser.email, "id", "Showing Cancelled", {
            buyerDisplayName: buyerUser.displayName,
            listingAddress: listing.fullAddress,
            cancelReason: cancelReason,
         });
         break;
      case 'rescheduled':
         sendEmail(buyerUser.email, "id", "Showing Rescheduled", {
            buyerDisplayName: buyerUser.displayName,
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