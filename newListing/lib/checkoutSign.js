const functions = require('firebase-functions');
const admin = require('firebase-admin');

const firestore = admin.firestore();

// this is where the sign logic should check out a sign for the user and place ther order with an admin....

const signCheckout = async () => {
    // grab first available 
    const webIdsRef = admin.firestore('lookup').doc('listingWebIds');

    try {
        await firestore.runTransaction(async (t) => {
            const doc = await t.get(webIdsRef);
            // sort through document to find first webId object
            // not already check out
            const sign = objectToArray(doc.data()).find((e) => e.checkedOut === false);

            if (sign) {
                const id = sign.signCode;
                console.log(id);
                let update = await t.update(webIdsRef, {
                    [`${id}.checkedOut`]: true,
                });
                console.log(update);
            } else {
                throw new Error('All signs have been checked out');
            }
        });
    } catch (error) {
        console.log(error);
    }
}

/**
 * Decrements counter when signs/webIds have been checked in
 */
exports.listingWebIdCounterDecrement = async () => {
    const ref = firestore.collection('lookup').doc('listingWebIdCounter');
    try {
        await firestore.runTransaction(async (t) => {
            const doc = await t.get(ref);

            // decrease counter by 1 if not already 0
            const count = doc.data().count;
            if (count !== 0) {
                const newCount = count - 1;
                t.update(ref, { count: newCount })
            } else {
                t.update(ref, { count: count })
            }
            functions.logger.log('Count Decrement  successful!');
        })
    } catch (e) {
        functions.logger.log('Count Decrement failure:', e);
    }
}


/**
 * Increments counter when sign/webId have been checked out
 * @param {number} [amount = 1] - Increments by 1 unless specified
 */
const listingWebIdCounterIncrement = async (amount = 1) => {
    const ref = firestore.collection('lookup').doc('listingWebIdCounter');
    try {
        await firestore.runTransaction(async (t) => {
            const doc = await t.get(ref);

            // increase counter by 1 if not already 0
            const count = doc.data().count;

            const newCount = count + amount;
            t.update(ref, { count: newCount })

            functions.logger.log('Count Increment  successful!');
        })
    } catch (e) {
        functions.logger.log('Count Increment failure:', e);
    }
}




const signCheckIn = () => {
    // check to make sure listing is no longer active that sign is checked in as
    // approve or decline based on return data
    // 
}

module.exports.listingWebIdCounterIncrement = listingWebIdCounterIncrement;