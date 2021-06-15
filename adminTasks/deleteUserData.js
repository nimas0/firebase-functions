const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();

const stripe = require('stripe')(functions.config().stripe.testkey);

'use strict';



/**
 * When a user deletes their account, clean up user generated data
 */


// TODO: Prevent headless data from occuring after account has been deleted.

exports.cleanupUser = functions.auth.user().onDelete(async (user) => {

    try {

        // START
        // delete the customers user data in firestore.
        const dbRef = admin.firestore().collection('users');
        await dbRef.doc(user.uid).delete();

        // delete the customers user data in realtime firebase.
        const rtdbRef = admin.database().ref('users/' + user.uid);
        await rtdbRef.remove();
        //end

        //START
        // delete checkin signs and delete property, if any exist

        // create a reference to the listings collection
        const listingRef = admin.firestore().collection('listings');
        // create a query against the collection
        const query = await listingRef.where('primaryOwnerId', '==', user.uid).get();
        // capture all the query result IDS
        functions.logger.log('listing-got this far')
        functions.logger.log('query', query)

        if (!query.empty) {
            query.forEach(async (doc) => {
                functions.logger.log(doc.id, ' => ', doc.data());
                // checkin sign
                functions.logger.log('signCode', doc.data().signCode.id)
                const signCode = doc.data().signCode.id;
                const listingWebIds = await admin.firestore().collection('lookup').doc('listingWebIds');
                listingWebIds.update({
                    [`${signCode}.checkedOut`]: false
                })
                // delete the customers user data in firestore.
                await listingRef.doc(doc.id).delete()
            })
        } else {
            functions.logger.log('query empty')
        }

        //end
        //START
        // delete interest, if any exist

        // create a reference to the listings collection
        const interestRef = admin.firestore().collection('interest');
        // create a query against the collection
        const queryInterest = await interestRef.where('buyer.buyerUid', '==', user.uid).get();
        // 
        functions.logger.log('interest-got this far')
        functions.logger.log('queryInterest', queryInterest)
        if (!queryInterest.empty) {

        queryInterest.forEach(async (doc) => {
            functions.logger.log('user\'s interest found', doc.data())
            functions.logger.log('user\'s interest found')
            await interestRef.doc(doc.id).delete()
        })
        } else {
            functions.logger.log('queryInterest111 empty')
        }

        //end




        return;

    } catch (error) {
        functions.logger.log(error)
    }







});

