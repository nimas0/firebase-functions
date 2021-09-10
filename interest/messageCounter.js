const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.newMessageCounter = functions.database.ref('/interest_chat/{interestId}/{pushId}')
    .onCreate(async (snapshot, context) => {
        functions.logger.log('test')
        // Grab the current value of what was written to the Realtime Database.
        const { author, displayName, message } = snapshot.val();
        const { interestId } = context.params;

        const buyerId = interestId.split('_')[1];
        const listingId = interestId.split('_')[0];


        try {
            const interest = admin.firestore().collection('interest').doc(interestId);
            const groupMessageCounter = admin.firestore().collection('message_counter').doc(listingId);
            if (buyerId !== author) {
                functions.logger.log('END MADE IT HERE END');
                //sdfsdf
                // update seller message counter
                await interest.update({
                    buyerMessageCounter: admin.firestore.FieldValue.increment(1)
                });

            } else {
                // update seller message counter
                await interest.update({
                    newMessageCount: admin.firestore.FieldValue.increment(1)
                });
                await groupMessageCounter.set({ count: admin.firestore.FieldValue.increment(1) }, { merge: true })
            }
        } catch (error) {
            functions.logger.log('newMessageCounter', error)
        }

        // You must return a Promise when performing asynchronous tasks inside a Functions such as
        // writing to the Firebase Realtime Database.
        // Setting an "uppercase" sibling in the Realtime Database returns a Promise.

    });


    exports.resetBuyerMessageCounter = functions.database.ref('/online/{interestId}/{pushId}')
    .onUpdate(async (change, context) => {
        functions.logger.log('test')

        const state = change.after.child('state').val();
        functions.logger.log('isOnline', state)

        // if state goes offline, do nothing.
        if (state !== 'online') {
            functions.logger.log('im out')
            return;
        }
        // Grab the current value of what was written to the Realtime Database.

        const { pushId: buyerId, interestId } = context.params;
        const listingId = interestId.split('_')[0];
        functions.logger.log("ids", buyerId, interestId)
        try {
            const interest = admin.firestore().collection('interest').doc(interestId);
          
                functions.logger.log('END MADE IT HERE END');
                //sdfsdf
                // update seller message counter
                await interest.update({
                    buyerMessageCounter: 0
                });

        } catch (error) {
            functions.logger.log('resetBuyerMessageCounter', error)
        }

    });