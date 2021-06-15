const functions = require('firebase-functions');
const admin = require('firebase-admin');

const shortid = require('shortid');
const { initialSetUpData } = require('../lib/homeDetailsStructureObject');
const stripe = require('stripe')(functions.config().stripe.testkey);
const db = admin.firestore();
const moment = require('moment');


//what do I change firebase route to in firestore?
exports.stripeCharge = functions.database
   .ref('/payments/{userId}/{paymentId}')
   .onCreate((snapshot, context) => {
      //TODO: does this work anymore? might need to be snapshot.data()
      const payment = snapshot.val();
      const genListingId = shortid.generate();
      const userId = context.params.userId;
      const paymentId = context.params.paymentId;
      functions.logger.log({ paymentId });
      //checks if payment exists or if it has already been charged
      if (!payment || payment.charge) return false;

      const amount = 99 * 100;
      const idempotencyKey = paymentId;
      const currency = 'usd';
      const description = 'Statement Description';
      const source = payment.token.id;
      const charge = { amount, currency, source, description };
      return (
         stripe.charges
            .create(charge, { idempotencyKey })
            .then((charge) => {
               return admin.database().ref(`payments/${userId}/${paymentId}/charge`).set(charge);
            })
            .then((results) => {
               return createListing(payment, userId, genListingId);
            })
            // PUSH ONBOARDING NOTIFCAITONS TO TASKBAR
            .then((showingId) => {
               console.log('[showingIDID]', showingId);
               let notificationRef = admin.database().ref(`notifications/${genListingId}`);
               let showingNotifcationRef = notificationRef.push();
               showingNotifcationRef.set({
                  data: {
                     buyerType: 'Example Buyer',
                     fullName: 'Justin Test',
                     scheduled: '2:00 - 3:00 pm',
                  },
                  required: true,
                  showingId: showingId,
                  title: 'Showing Request',
                  type: 1,
               });

               let infoNotificationRef = notificationRef.push();
               infoNotificationRef.set({
                  action: '/account/listing/information',
                  actionType: 'route',
                  description: 'To complete onboarding add your homes details',
                  required: true,
                  title: 'Home Details',
                  type: 3,
               });

               let photoNotificationRef = notificationRef.push();
               photoNotificationRef.set({
                  action: '/account/listing/photos',
                  actionType: 'route',
                  description: 'To complete onboarding you must upload your listing photos',
                  required: true,
                  title: 'Upload Photos',
                  type: 3,
               });

               let docNotificationRef = notificationRef.push();
               return docNotificationRef.set({
                  action: '/account/listing/documents',
                  actionType: 'route',
                  description: 'To complete onboarding create your seller disclosures',
                  required: true,
                  title: 'Seller Disclosures',
                  type: 3,
               });
            })
            // CREATE ADMIN TASKS
            .then((moreResults) => {
               console.log('Admin Portion');
               return admin
                  .firestore()
                  .collection('adminTasks')
                  .add({
                     type: 'newListing',
                     data: {
                        photography: 'Future Photography Date',
                        time: [...payment.data.photographyTimes],
                     },
                  });
            })

            // ADD PAYMENT DETAILS TO FIRESTORE LISTING
            .then((r) => {
               return admin
                  .database()
                  .ref(`payments/${userId}/${paymentId}/listing`)
                  .set(genListingId);
            })
            .catch((err) => {
               return console.log('[Error processing Payment]', err);
            })
      );
   });

const createListing = async (values, uId, genListingId) => {
   let shippingAddress;
   const { id } = values.token;
   const { shippingSameAsHome, homeAddress, payment } = values.data;
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
            paymentId: id,
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
