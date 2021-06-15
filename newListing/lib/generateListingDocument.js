const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firestore = admin.firestore();

const shortid = require('shortid');
const { initialSetUpData } = require('./homeDetailsStructureObject');



/**
 * 
 * @param {object} values - address, marketingPackage, paymentId, other form data
 * @param {*} uId - User ID
 * @param {*} genListingId - 
 */

module.exports.generateListingDocument = async (values, uId, genListingId) => {

    // paymentId
    // const id = values.id;
    const { homeAddress, marketingPackage } = values.data;

    //break address apart into an object
    const { streetNumber, streetName, city, state } = createAddressComponents(
        homeAddress.address_components
    );

    try {
        //create and add setup information into database
        await db
            .collection('listings')
            .doc(genListingId)
            .set({
                fullAddress: homeAddress.formatted_address,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                id: genListingId,
                primaryOwnerId: uId,
                ...initialSetUpData(homeAddress.address_components),
            });

        // add question1 to subcollection on listing
        await db.collection('listings').doc(genListingId).collection('questions').add({
            created: admin.firestore.FieldValue.serverTimestamp(),
            deleted: false,
            internal: true,
            public: false,
            question: 'This is an example Question?',
            response: 'This is a example response',
        });


        // create example showing tied to fake account for tour/onboarding purposes
        let showingId = await db.collection(`showings`).add({
            buyerUser: {
                displayName: 'John Doe',
                email: 'johndoe@example.com',
                id: 'D8PtcQwbkLgBYjigeUoTYP5xzoE2',
            },
            dateCreated: admin.firestore.FieldValue.serverTimestamp(),
            duration: 60,
            listingId: genListingId,
            cancelled: false,
            comment: 'Excited to see your home. My mother lives down the road from you.',
            scheduled: admin.firestore.Timestamp.fromDate(new Date()),
            instructions: '',
            sellerUserId: uId,
            type: 'First Time Homebuyer',
            status: 'pending',
        });

        //create example lead tied to fake account for tour/onboarding purposes
        await db
            .collection('interest')
            .doc(`${genListingId}_D8PtcQwbkLgBYjigeUoTYP5xzoE2`)
            .set({
                buyer: {
                    buyerUid: 'D8PtcQwbkLgBYjigeUoTYP5xzoE2',
                    displayName: 'John Doe',
                    photoURL:
                        'https://lh3.googleusercontent.com/a-/AAuE7mDnqbDP5hkjAMn-fLU6t2ShZ8zvGLpwcZkuz5ev',
                    preApproval: 'Bank of America',
                    socialProfile: 'FB.com/aslkdfjasldkfj',
                    type: 'First Time HomeBuyer',
                },
                dateCreated: admin.firestore.FieldValue.serverTimestamp(),
                feedback:
                    'Home was very nice. We still have a few more homes to look at but will be in touch soon!',
                lastViewed: admin.firestore.FieldValue.serverTimestamp(),
                leadStrength: 2,
                listingId: genListingId,
                listingSnapshot: {
                    streetNumber: streetNumber,
                    streetName: streetName,
                    city: city,
                    state: state,
                    listingMainPhotoUrl: 'https://firebasestorage.googleapis.com/v0/b/finding-spaces-73b23.appspot.com/o/websiteimages%2FDefaultListingPhoto3.png?alt=media&token=f3b94dcc-ba5d-4bf7-be48-08fe6acd442d',
             
                },
                newMessageCount: 0,
                showingCount: 0,
            });

        //atomically    ate listings array in [USER DOCUMENT]
        let userRef = db.collection('users').doc(uId);
        await userRef.update({
            listings: admin.firestore.FieldValue.arrayUnion({ id: genListingId, role: 'owner' }),
            defaultListingId: genListingId,
        });

        console.log('showingId', showingId.id);
    } catch (error) {
        console.log('[ERROR]', error);
    }
};



//helper function
const createAddressComponents = (addressPartsArray) => {
    const addressBreakDown = [
        'streetNumber',
        'streetName',
        'city',
        'county',
        'state',
        'country',
        'zip',
        'zipExtra',
    ];
    let addressObject = {};
    addressPartsArray.map(
        (part, index) => (addressObject[addressBreakDown[index]] = part.long_name)
    );
    return addressObject;
};

module.exports = generateListingDocument;


