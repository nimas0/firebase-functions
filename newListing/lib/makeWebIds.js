const functions = require('firebase-functions');
const admin = require('firebase-admin');
const checkout = require('./checkoutSign')

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

exports.generateListingIds = functions.firestore
    .document('lookup/listingWebIds')
    .onDelete((snap, context) => {
        let ids = {};
        for (let i = 0; i < 100; i++) {
            const idData = makeListingId();
            ids[idData.signCode] = idData;
        }
        functions.logger.log(ids);
        return admin.firestore().collection('lookup').doc('listingWebIds').set({
            ...ids
        }).then((results => checkout.listingWebIdCounterIncrement(100)))
            .catch((error) => console.log(error))
    })