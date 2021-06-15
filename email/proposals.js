const functions = require('firebase-functions');
const admin = require('firebase-admin');



// - New proposal alert to both parties ---------------------------------//

exports.newProposal = functions.firestore.document('proposals/{proposalsId}').onCreate(async (snap, context) => {

    // if self generated, then bail out
    // if anon, handle no user data

    // extract data from snap
    const { listingId, offerDetails, owner, state } = snap.data();
    const { proposalId } = context.params;

    try {


        // Bring in primary user email tied to listing
        const listingRef = admin.firestore().collection('listings');
        const listing = (await listingRef.doc(listingId).get()).data();

        let sellerSnapshot = await admin.database().ref(`users/${listing.primaryOwnerId}`).once('value');
        let sellerUser = (sellerSnapshot.val() && sellerSnapshot.val())
        const sellerEmail = sellerUser.email;
        const sellerDisplayName = sellerUser.displayName;

        // As it stands, only the buyer can submit offers
        let buyerName;
        let buyerEmail;


        let buyerSnapshot = await admin.database().ref(`users/${owner.id}`).once('value')
        let buyerDisplayName = (buyerSnapshot.val() && buyerSnapshot.val().displayName)
        buyerName = buyerDisplayName
        buyerEmail = (buyerSnapshot.val() && buyerSnapshot.val().email)

        functions.logger.log('data', snap.data());

        // TODO: sellerDisplayName in data object is incorrect and should be buyerDisplayName but would require html refactoring. Just leaving it for now.
        const compose = await admin.firestore().collection('mail').add({
            to: sellerDisplayName,
            template: {
                name: 'ProposalNew',
                subject: 'You have a new Offer!',
                data: {
                    sellerDisplayName: buyerDisplayName,
                    amount: offerDetails.amount,
                    address: listing.fullAddress
                }
            }
        })

        functions.logger.log('newproposal', compose);


    } catch (error) {
        functions.logger.log(error);
    }

})




//proposal approved to both parties
exports.acceptOffer = functions.firestore.document('proposals/{proposalsId}').onUpdate(async (change, context) => {

    const previous = change.before.data();
    const updated = change.after.data();

    // extract data from snap
    const { proposalId } = context.params;

    try {

        // filter out any change that is not an accetance change
        if (updated.state !== 'accepted') return null;

        // Bring in primary user email tied to listing
        const listingRef = admin.firestore().collection('listings');
        const listing = (await listingRef.doc(updated.listingId).get()).data();

        let sellerSnapshot = await admin.database().ref(`users/${listing.primaryOwnerId}`).once('value');
        let sellerUser = (sellerSnapshot.val() && sellerSnapshot.val())
        const sellerEmail = sellerUser.email;
        const sellerDisplayName = sellerUser.displayName;

        // As it stands, only the buyer can submit offers
        let buyerName;
        let buyerEmail;


        let buyerSnapshot = await admin.database().ref(`users/${updated.owner.id}`).once('value')
        let buyerDisplayName = (buyerSnapshot.val() && buyerSnapshot.val().displayName)
        buyerName = buyerDisplayName
        buyerEmail = (buyerSnapshot.val() && buyerSnapshot.val().email)




        const compose = await admin.firestore().collection('mail').add({
            to: buyerEmail,
            template: {
                name: 'ProposalAccepted',
                data: {
                    sellerDisplayName: sellerDisplayName,
                    amount: updated.offerDetails.amount,
                }
            }
        })

        functions.logger.log('accepted', sellerEmail);


    } catch (error) {
        functions.logger.log(error);
    }

})
//

// - proposal rejects  ---------------------------------//

exports.rejectProposal = functions.firestore.document('proposals/{proposalsId}').onUpdate(async (change, context) => {

    const previous = change.before.data();
    const updated = change.after.data();

    // extract data from snap
    const { proposalId } = context.params;

    try {

        if (updated.state !== 'rejected') return null;

        // Bring in primary user email tied to listing
        const listingRef = admin.firestore().collection('listings');
        const listing = (await listingRef.doc(updated.listingId).get()).data();

        let sellerSnapshot = await admin.database().ref(`users/${listing.primaryOwnerId}`).once('value');
        let sellerUser = (sellerSnapshot.val() && sellerSnapshot.val())
        const sellerEmail = sellerUser.email;
        const sellerDisplayName = sellerUser.displayName;

        // As it stands, only the buyer can submit offers
        let buyerName;
        let buyerEmail;


        let buyerSnapshot = await admin.database().ref(`users/${updated.owner.id}`).once('value')
        let buyerDisplayName = (buyerSnapshot.val() && buyerSnapshot.val().displayName)
        buyerName = buyerDisplayName
        buyerEmail = (buyerSnapshot.val() && buyerSnapshot.val().email)




        const compose = await admin.firestore().collection('mail').add({
            to: buyerEmail,
            template: {
                name: 'ProposalRejected',
                data: {
                    sellerDisplayName: sellerDisplayName,
                    price: updated.offerDetails.amount,
                    address: listing.fullAddress
                }
            }
        })

        functions.logger.log('rejected', sellerEmail);


    } catch (error) {
        functions.logger.log(error);
    }

})


//batch new messages


