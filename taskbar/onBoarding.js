const functions = require('firebase-functions');
const admin = require('firebase-admin');


module.exports = functions.firestore
   .document('listings/{listingId}')
   .onUpdate((change, context) => {
      const newValue = change.after.data();
      const previousValue = change.before.data();

      console.log({ change });
      console.log({ newValue });
      console.log({ previousValue });

      // if info has already been initialized or if something other than information is being updated
      if (
         !newValue.initialized.information ||
         newValue.initialized.information === previousValue.initialized.information
      )
         return false;

      console.log('information submitted');
      let notificationRef = admin
         .database()
         .ref(`/notifications/${context.params.listingId}/onboarding_information`);
      return notificationRef
         .remove()
         .then(results => {
            return console.log('Notification was deleted successfully');
         })
         .catch(err => {
            return console.log('Error deleting notication', err);
         });
   });
