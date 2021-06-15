


exports.createListing = async (values, uId, genListingId) => {
    let shippingAddress;
    const { shippingSameAsHome, homeAddress } = values.data;
    // format object to address
    const { streetNumber, streetName, city, state } = createAddressComponents(
        homeAddress.address_components
    );
    if (shippingSameAsHome === true) {
        shippingAddress = homeAddress.formatted_address;
    } else {
        shippingAddress = values.shippingAddress || '';
    }

    try {
        //create and add setup information into database
        await db
            .collection('listings')
            .doc(genListingId)
            .set({
                fullAddress: homeAddress.formatted_address,
                shippingAddress: shippingAddress,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                id: genListingId,
                primaryOwnerId: uId,
                ...initialSetUpData(homeAddress.address_components),
            });

        //add question1 to subcollection on listing
        await db.collection('listings').doc(genListingId).collection('questions').add({
            created: admin.firestore.FieldValue.serverTimestamp(),
            deleted: false,
            internal: true,
            public: true,
            question: 'What is your favorite part about the home?',
            response: 'question1',
        });

        //add question2 to the subcolleciton of listing
        await db.collection('listings').doc(genListingId).collection('questions').add({
            created: admin.firestore.FieldValue.serverTimestamp(),
            deleted: false,
            internal: true,
            public: true,
            question: 'What is the best part about the area?',
            response: 'question2',
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
                },
                listingMainPhotoUrl: 'https://firebasestorage.googleapis.com/v0/b/finding-spaces-73b23.appspot.com/o/websiteimages%2FDefaultListingPhoto3.png?alt=media&token=f3b94dcc-ba5d-4bf7-be48-08fe6acd442d',
                newMessageCount: 0,
                showingCount: 0,
            });

        //atomically update listings array in [USER DOCUMENT]
        let userRef = db.collection('users').doc(uId);
        let arrUnion = userRef.update({
            listings: admin.firestore.FieldValue.arrayUnion({ id: genListingId, role: 'owner' }),
            defaultListingId: genListingId,
        });

        console.log('showingId', showingId.id);
        return showingId.id;
    } catch (error) {
        console.log('[ERROR]', error);
    }
};

// HELPER FUNCTIONS
// break apart address from google maps api and convert to object
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