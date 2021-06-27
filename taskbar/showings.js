const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();




module.exports = functions.firestore.document('showings/{showingId}').onCreate(async (snap, context) => {


    const { listingId, buyerUser, scheduled, isExample } = snap.data();
    const showingId = context.params.showingId;


    functions.logger.log('snapdata', snap.data())
    functions.logger.log('snap', context)
    try {
        // bail out if this is the sample onboarding tasks
        if (isExample) return;
        functions.logger.log('made it this far')
        // showing notification 
        let notificationRef = await admin.database().ref(`notifications/${listingId}`);
        functions.logger.log('made it this far2')
        let showingNotifcationRef = await notificationRef.push();
        await showingNotifcationRef.set({
            data: {
                fullName: buyerUser.displayName,
                scheduled: new Date(scheduled._seconds * 1000),
            },
            required: true,
            showingId: showingId,
            title: 'Showing Request',
            type: 1,
        });


    } catch (error) {
        functions.logger.log(error);
    }

})