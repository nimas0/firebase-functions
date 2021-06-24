const approved = async (admin, updated) => {
console.log('approved')
 // destructure changes
 const {
    buyerUser,
    listingId,
  } = updated;

  try {

      // grab listing Address
      const listingRef = admin.firestore().collection('listings');
      const listing = (await listingRef.doc(listingId).get()).data();

      // grab seller display name
      // grab seller email
    //   let sellerSnapshot = await admin
    //     .database()
    //     .ref(`users/${listing.primaryOwnerId}`)
    //     .once('value');
    //   let sellerUser = sellerSnapshot.val() && sellerSnapshot.val();
    //   const sellerEmail = sellerUser.email;
    //   const sellerDisplayName = sellerUser.displayName;

      // send email
      const compose = await admin
        .firestore()
        .collection('mail')
        .add({
          to: buyerUser.email,
          template: {
            name: 'ShowingAccepted',
            data: {
              buyerDisplayName: buyerUser.displayName,
              listingAddress: listing.fullAddress,
            },
          },
        });

  } catch (error) {
    functions.logger.log('approvedshowingnotif', error);
  }
}


exports.approved = approved;



