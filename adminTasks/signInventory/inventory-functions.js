const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firestore = admin.firestore();
exports.checkout = async () => {
    const webIdsRef = admin.firestore().collection('lookup').doc('listingWebIds');
    let checkedOutSign = 'test';
    try {

        await admin.firestore().runTransaction(async (t) => {
            const doc = await t.get(webIdsRef);
            // sort through document to find first webId object
            // not already check out
            const sign = objectToArray(doc.data()).find((e) => e.checkedOut === false);

            if (sign) {
                const id = sign.signCode;
                functions.logger.log('sign-inventory', id);
                let update = await t.update(webIdsRef, {
                    [`${id}.checkedOut`]: true,
                });
                functions.logger.log('sign-sdff', update);
                await listingWebIdCounterDecrement(100);
                checkedOutSign = sign;

            } else {
                throw new Error('All signs have bee checked out');
            }
        });
        return checkedOutSign;
    } catch (error) {
        functions.logger.log('[sign-inventory]', error);
    }
};





// HELPERS

//decrement sign invetory count
const listingWebIdCounterDecrement = async () => {
    const ref = admin.firestore().collection('lookup').doc('listingWebIdCounter');
    try {
        await admin.firestore().runTransaction(async (t) => {
            const doc = await t.get(ref);

            // decrease counter by 1 if not already 0
            const count = doc.data().count;
            if (count !== 0) {
                const newCount = count - 1;
                t.update(ref, { count: newCount });
            } else {
                t.update(ref, { count: count });
            }
            functions.logger.log('[sign-inventory]', 'Count Decrement  successful!');
        });
    } catch (e) {
        functions.logger.log('[sign-inventory]', 'Count Decrement failure:', e);
    }
};

//increment sign invetory count
const listingWebIdCounterIncrement = async (amount = 1) => {
    const ref = admin.firestore().collection('lookup').doc('listingWebIdCounter');
    try {
        await admin.firestore().runTransaction(async (t) => {
            const doc = await t.get(ref);

            // increase counter by 1 if not already 0
            const count = doc.data().count;

            const newCount = count + amount;
            t.update(ref, { count: newCount });

            functions.logger.log('[sign-inventory]', 'Count Decrement  successful!');
        });
    } catch (e) {
        functions.logger.log('[sign-inventory]', 'Count Decrement failure:', e);
    }
};






// TODO: add this code to the admin dashboard or automate generate at a later date

// make 100 new ids
const makeListingId = () => {
    // generate two random letters
    var letters = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var charactersLength = characters.length;
    for (var i = 0; i < 2; i++) {
        letters += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    // generate three random integers
    let number;
    do {
        number = Math.floor(Math.random() * 999);
    } while (number < 100);
    return {
        letters: letters,
        number: number,
        formatted: `${letters}-${number}`,
        signCode: letters + number,
        checkedOut: false,
    };
};

// push all new listingIds to an array
let idArray = [];
for (let i = 0; i < 50; i++) {
    const idData = makeListingId();
    idArray.push({ [idData.signCode]: idData });
}

const objectToArray = (object) => {
    if (object) {
        return Object.entries(object).map((e) => Object.assign({}, e[1], { id: e[0] }));
    }
};