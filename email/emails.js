const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Welcome email to any new user that signs up regardless of customer type
exports.sendWelcomeEmail = functions.auth.user().onCreate(async (user) => {
  const { email, displayName } = user;

  try {
    const compose = await admin
      .firestore()
      .collection('mail')
      .add({
        to: email,
        template: {
          name: 'WelcomeMail',
          data: {
            email: email,
            username: email,
            name: displayName,
          },
        },
      });

    const copyEmailToAdmin = await admin
      .firestore()
      .collection('mail')
      .add({
        to: 'support@findingspaces.com',
        template: {
          name: 'WelcomeMail',
          subject: 'NEW USER SIGN UP',
          data: {
            email: email,
            username: email,
            name: displayName,
          },
        },
      });

    functions.logger.log('NEWUSEREMAIL', email);
  } catch (error) {
    functions.logger.log(error);
  }
});

// Seller notified about a new question that needs to be answered
exports.sendNewQuestionEmail = functions.firestore
  .document('listings/{listingId}/questions/{questionId}')
  .onCreate(async (snap, context) => {
    // if self generated, then bail out
    // if anon, handle no user data

    // extract data from snap
    const {
      internal,
      question,
      userId,
      firstName = null,
      lastName = null,
      email = null,
    } = snap.data();
    const { listingId } = context.params;

    try {
      // do not send email if question was generated internally
      if (internal) return;
      // Bring in primary user email tied to listing
      const listingRef = admin.firestore().collection('listings');
      const listing = (await listingRef.doc(listingId).get()).data();

      let sellerSnapshot = await admin
        .database()
        .ref(`users/${listing.primaryOwnerId}`)
        .once('value');
      let sellerUser = sellerSnapshot.val() && sellerSnapshot.val();
      const sellerEmail = sellerUser.email;
      const sellerDisplayName = sellerUser.displayName;

      let buyerName;

      if (userId) {
        let buyerSnapshot = await admin
          .database()
          .ref(`users/${userId}`)
          .once('value');
        let buyerDisplayName =
          buyerSnapshot.val() && buyerSnapshot.val().displayName;
        buyerName = buyerDisplayName;
      } else {
        buyerName = `${firstName} ${lastName}`;
      }

      const compose = await admin
        .firestore()
        .collection('mail')
        .add({
          to: sellerEmail,
          template: {
            name: 'NewQuestion',
            data: {
              sellerDisplayName: sellerDisplayName,
              question: question,
              displayName: buyerName,
            },
          },
        });

      functions.logger.log('buyerName', buyerName);
      functions.logger.log('question', question);
      functions.logger.log('question', sellerEmail);
    } catch (error) {
      functions.logger.log(error);
    }
  });

// Buyer notified of seller's response to his/her question
exports.sendQuestionAnsweredEmail = functions.firestore
  .document('listings/{listingId}/questions/{questionId}')
  .onUpdate(async (change, context) => {
    const previous = change.before.data();
    const updated = change.after.data();

    const {
      internal,
      question,
      userId,
      firstName = null,
      lastName = null,
      email = null,
    } = updated;
    const { listingId } = context.params;

    // do not send email if question was generated internally
    if (internal) return;

    // bail out if response already exists
    if (previous.response && updated.response) return;

    try {
      // Bring in primary user email tied to listing
      const listingRef = admin.firestore().collection('listings');
      const listing = (await listingRef.doc(listingId).get()).data();

      let sellerSnapshot = await admin
        .database()
        .ref(`users/${listing.primaryOwnerId}`)
        .once('value');
      let sellerUser = sellerSnapshot.val() && sellerSnapshot.val();
      const sellerEmail = sellerUser.email;
      const sellerDisplayName = sellerUser.displayName;

      let buyerName;
      let buyerEmail;

      if (userId) {
        let buyerSnapshot = await admin
          .database()
          .ref(`users/${userId}`)
          .once('value');
        let buyerUser = buyerSnapshot.val() && buyerSnapshot.val();
        buyerName = buyerUser.displayName;
        buyerEmail = buyerUser.email;
      } else {
        buyerName = `${firstName} ${lastName}`;
        buyerEmail = email;
      }

      const compose = await admin
        .firestore()
        .collection('mail')
        .add({
          to: buyerEmail,
          template: {
            name: 'NewQuestionResponse',
            data: {
              buyerDisplayName: buyerName,
              sellerDisplayName: sellerDisplayName,
              question: question,
              listingAddress: listing.fullAddress,
              listingId: listingId,
            },
          },
        });
    } catch (error) {
      functions.logger.log('QUESTIONANSWERED', error);
    }
  });

// Seller notified of a new showing
exports.sendShowingRequestNew = functions.firestore
  .document('showings/{showingId}')
  .onCreate(async (snap, context) => {
    const {
      buyerUser,
      buyerUserId,
      dateCreated,
      duration,
      listingId,
      scheduled,
      status,
      isExample,
    } = snap.data();

    const { showingId } = context.params;

    // bail out if this was generated as an example for a new listing
    if (isExample) return;

    try {
      // get seller display name
      // get seller email
      // get listing Address

      const listingRef = admin.firestore().collection('listings');
      const listing = (await listingRef.doc(listingId).get()).data();

      let sellerSnapshot = await admin
        .database()
        .ref(`users/${listing.primaryOwnerId}`)
        .once('value');
      let sellerUser = sellerSnapshot.val() && sellerSnapshot.val();
      const sellerEmail = sellerUser.email;
      const sellerDisplayName = sellerUser.displayName;

      const compose = await admin
        .firestore()
        .collection('mail')
        .add({
          to: sellerEmail,
          template: {
            name: 'ShowingRequestNew',
            data: {
              buyerDisplayName: buyerUser.displayName,
              sellerDisplayName: sellerDisplayName,
              scheduledTime: new Date(
                scheduled.seconds * 1000
              ).toLocaleString(),
              listingAddress: listing.fullAddress,
            },
          },
        });
    } catch (error) {
      functions.logger.log('showingrequestnew', error);
    }
  });

// Buyer notified of seller's decision to cancel showing
exports.sendShowingRequestCancelled = functions.firestore
  .document('showings/{showingId}')
  .onUpdate(async (change, context) => {
    const previous = change.before.data();
    const updated = change.after.data();

    const prevStatus = previous.status;

    // destructure changes
    const {
      buyerUser,
      buyerUserId,
      dateCreated,
      duration,
      listingId,
      scheduled,
      cancelled = null,
      cancelReason = null,
      status,
    } = updated;

    const { showingId } = context.params;

    try {
      // get seller display name
      // get seller email
      // get listing Address

      if (status === 'denied' && prevStatus === 'pending') {
        const listingRef = admin.firestore().collection('listings');
        const listing = (await listingRef.doc(listingId).get()).data();

        let sellerSnapshot = await admin
          .database()
          .ref(`users/${listing.primaryOwnerId}`)
          .once('value');
        let sellerUser = sellerSnapshot.val() && sellerSnapshot.val();
        const sellerEmail = sellerUser.email;
        const sellerDisplayName = sellerUser.displayName;

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
      }
    } catch (error) {
      functions.logger.log('showingrequestnew', error);
    }
  });

// Seller notified about his/her new lead
exports.sendNewLead = functions.firestore
  .document('interest/{interstId}')
  .onCreate(async (snap, context) => {
    const { buyer, feedback = null, listingId, isExample } = snap.data();

    // bail out if this was generated as an example for a new listing
    if (isExample) return;

    try {
      // get seller display name
      // get seller email
      // get listing Address

      const listingRef = admin.firestore().collection('listings');
      const listing = (await listingRef.doc(listingId).get()).data();

      let sellerSnapshot = await admin
        .database()
        .ref(`users/${listing.primaryOwnerId}`)
        .once('value');
      let sellerUser = sellerSnapshot.val() && sellerSnapshot.val();
      const sellerEmail = sellerUser.email;
      const sellerDisplayName = sellerUser.displayName;

      const compose = await admin
        .firestore()
        .collection('mail')
        .add({
          to: sellerEmail,
          template: {
            name: 'NewLead',
            data: {
              buyerDisplayName: buyer.displayName,
              listingAddress: listing.fullAddress,
              feedback: feedback,
            },
          },
        });
    } catch (error) {
      functions.logger.log('newlead', error);
    }
  });

// Buyer notified of Seller's decision to accept the showing
exports.sendShowingRequestAccepted = functions.firestore
  .document('showings/{showingId}')
  .onUpdate(async (change, context) => {
    const previous = change.before.data();
    const updated = change.after.data();

    const prevStatus = previous.status;

    // destructure changes
    const {
      buyerUser,
      buyerUserId,
      dateCreated,
      duration,
      listingId,
      scheduled,
      cancelled = null,
      cancelReason = null,
      status,
    } = updated;

    const { showingId } = context.params;

    try {
      if (status === 'approved' && prevStatus === 'pending') {
        // grab listing Address
        const listingRef = admin.firestore().collection('listings');
        const listing = (await listingRef.doc(listingId).get()).data();

        // grab seller display name
        // grab seller email
        let sellerSnapshot = await admin
          .database()
          .ref(`users/${listing.primaryOwnerId}`)
          .once('value');
        let sellerUser = sellerSnapshot.val() && sellerSnapshot.val();
        const sellerEmail = sellerUser.email;
        const sellerDisplayName = sellerUser.displayName;

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
      }
    } catch (error) {
      functions.logger.log('showingrequestnew', error);
    }
  });

// copied and pasted function... it needs to be refactored
// exports.sendShowingInstructionsUpdate = functions.firestore.document('showings/{showingId}').onUpdate(async (change, context) => {
//     const previous = change.before.data();
//     const updated = change.after.data();

//     const {
//         buyerUser,
//         buyerUserId,
//         dateCreated,
//         duration, listingId,
//         scheduled,
//         cancelled = null,
//         cancelReason = null,
//         status } = updated;

//     const { showingId } = context.params;

//     try {
//         // get seller display name
//         // get seller email
//         // get listing Address

//         const listingRef = admin.firestore().collection('listings');
//         const listing = (await listingRef.doc(listingId).get()).data();

//         let sellerSnapshot = await admin.database().ref(`users/${listing.primaryOwnerId}`).once('value');
//         let sellerUser = (sellerSnapshot.val() && sellerSnapshot.val())
//         const sellerEmail = sellerUser.email;
//         const sellerDisplayName = sellerUser.displayName;

//         const compose = await admin.firestore().collection('mail').add({
//             to: buyerUser.email,
//             template: {
//                 name: 'ShowingCancelled',
//                 data: {
//                     buyerDisplayName: buyerUser.displayName,
//                     listingAddress: listing.fullAddress,
//                     cancelReason: cancelReason
//                 }
//             }
//         })

//     } catch (error) {
//         functions.logger.log('showingrequestnew', error)
//     }

// })

// exports.textStatus = functions.firestore
//     .document('interest/{interestId}')
//     .onUpdate((change, context) => {

//         const previous = change.before.data();

//         const updated = change.after.data();

//         // bail out if there is no proposal created
//         if (!updated.proposal) return null;

//         // compare ids
//         let prevDocId = previous.proposal.latestQuickFacts.docId;
//         let updatedDocId = updated.proposal.latestQuickFacts.docId;

//         // if docIds did not change, then we know a new offer has not been submitted
//         // therefor we should bail out of this functions
//         if (prevDocId === updatedDocId) return null;
//         // create id for sms_noreply collection
//         // send to callback to generate delivery status
//         const docSmsId = shortid.generate();
//         return admin.firestore()
//             .collection('interest').doc(context.params.interestId)
//             .get()
//             .then((doc) => {
//                 if (doc.exists) {
//                     const phoneNumber = '12702312537'

//                     if (!validE164(phoneNumber)) {
//                         throw new Error('number must be E164 format!')
//                     }

//                     const textMessage = {
//                         body: `What's good with you mane`,
//                         to: phoneNumber,  // Text to this number
//                         from: twilioNumber, // From a valid Twilio number,
//                         statusCallback: `https://us-central1-finding-spaces-73b23.cloudfunctions.net/callback-callback?smsId=${docSmsId}`,
//                     }

//                     return client.messages.create(textMessage)
//                 } else {
//                     return functions.logger.log('No such document exists')
//                 }

//             }).then(message => {
//                 functions.logger.log(message, 'success')
//                 return admin.firestore().collection('sms_noreply').doc(docSmsId).set({ data: JSON.parse(JSON.stringify(message)) })

//             })
//             .then((results) => admin.firestore().collection('mail').add({
//                 to: 'nick@beyondsocial.io',
//                 message: {
//                     subject: 'Hello from Firebase!',
//                     text: 'This is the plaintext section of the email body.',
//                     html: 'This is the <code>HTML</code> section of the email body.',
//                 }
//             })).then(() => console.log('Queued email for delivery!'))
//             .catch(err => console.log(err))
//     })
