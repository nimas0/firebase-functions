
const cancelled = async (admin, updated, ctx, functions) => {
    console.log('cancelled') 
    // destructure changes
    const {
        buyerUser,
        listingId,
        cancelReason = null,
      } = updated;
  
    const { showingId } = ctx.params;
      console.log('updated', updated)

      try {
        const listingRef = admin.firestore().collection('listings');
        const listing = (await listingRef.doc(listingId).get()).data();
        // let sellerSnapshot = await admin
        // .database()
        // .ref(`users/${listing.primaryOwnerId}`)
        // .once('value');
        // let sellerUser = sellerSnapshot.val() && sellerSnapshot.val();
        // const sellerEmail = sellerUser.email;
        // const sellerDisplayName = sellerUser.displayName;
    
        const compose = await admin
        .firestore()
        .collection('mail')
        .add({
            to: buyerUser.email,
            template: {
            name: 'ShowingCancelled',
            data: {
                buyerDisplayName: buyerUser.displayName,
                listingAddress: listing.fullAddress,
                cancelReason: cancelReason,
            },
            },
        });

        console.log('compose', compose)
      } catch (error) {
          functions.logger.error(errror)
      }

    
       
}


exports.cancelled = cancelled;