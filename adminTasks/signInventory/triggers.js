const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firestore = admin.firestore();



// alert if new signs are needed to be ordered
exports.default = functions.firestore
    .document('lookup/listingWebIdCounter')
    .onUpdate(async (change, context) => {
        const newValue = change.after.data();


        try {
            functions.logger.log({ newValue });
            if (newValue.count < 25) {
                firestore.collection('adminTasks').add({
                    priority: 'urgent',
                    type: 'onboarding',
                    message: `Only ${count} left available. Order more signs`
                })
                functions.logger.log('Succesfully added admin tasks ORDER MORE SIGNS ')
                return null;
            }
            functions.logger.log('No need to order more signs')
        } catch (error) {
            functions.logger.log('Order More Signs', error);
        }
        return null;

    })