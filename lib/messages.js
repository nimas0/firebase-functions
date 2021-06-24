const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.scheduledMessages = functions.pubsub.schedule('every 60 minutes').onRun(async (context) => {

  // grab all message_counter documents
  // select related collection
  const messageCounterRef = admin.firestore().collection('message_counter');
  //create a query against the collection
  const query = messageCounterRef.where('count', '>', 0);

  // initialize array to hold all the ids that need processing


  try {
    let isArray = [];
    // get query results and add them to idArray
    const snapshot = await query.get();
    snapshot.forEach((doc) => isArray.push({ id: doc.id, ...doc.data() }));
    functions.logger.log('snapshot', snapshot);
    // filter out unchanged ids from the previous processing event
    let filteredArray = [];
    filteredArray = isArray.filter(message => message.prevCount !== message.count);

    functions.logger.log('filteredArray', filteredArray);
    // if message_counter doesn't contain a seller email, grab it
    const hasSellerEmail = filteredArray.map(async (messageCounter) => {
      functions.logger.log('messageCounter', !(messageCounter.hasOwnProperty('sellerEmail')))
      // check to see if email exists
      // if not add prev count and move on.
      functions.logger.log('messageCounter1', messageCounter)

      if (!(messageCounter.hasOwnProperty('sellerEmail'))) {
        // Bring in primary user email tied to listing
        const listingRef = admin.firestore().collection('listings');
        const q = await listingRef.doc(messageCounter.id).get();
        // const listing =  q.data();
        functions.logger.log('listing', q.data().primaryOwnerId)
        let sellerSnapshot = await admin.database().ref(`users/${q.data().primaryOwnerId}`).once('value');
        let sellerUser = (sellerSnapshot.val() && sellerSnapshot.val())
        const sellerEmail = sellerUser.email;
        const sellerDisplayName = sellerUser.displayName;

        functions.logger.log('sellerEmail', { sellerEmail: sellerEmail, ...messageCounter });
        return { sellerEmail: sellerEmail, ...messageCounter };
      }
      // messageCounter.prevCount = messageCounter.count;
      return { prevCount: messageCounter.count, ...messageCounter };
    })

    functions.logger.log('hasSeller', hasSellerEmail)
    functions.logger.log('filtered', filteredArray)
    hasSellerEmail.forEach((counterObject => {
      return async () => await admin.firestore()
        .collection('mail').add({
          to: counterObject.sellerEmail,
          template: {
            name: 'seller_bulk_message_1hr',
            data: {
              count: counterObject.count,

            }
          }
        })
    }))

  } catch (error) {
    functions.logger.log('messages', error)
  }

});

  // anytime there is a new buyer message, add to total listing new message count
  // anytime a counter is reset on interestId for seller, subtract former total from listing total
  // 
  // onCreate New Message Trigger
  // trigger the counter


  // reset Counter Feature

  //reduce counter function