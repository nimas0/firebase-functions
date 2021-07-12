

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {uid: shortid} = require('uid');
const db = admin.firestore();
const stripe = require('stripe')(functions.config().stripe.prodkey);
const moment = require('moment');
const { initialSetUpData } = require('./lib/homeDetailsStructureObject');
const { checkout } = require('../adminTasks/signInventory/inventory-functions');


/**
 * When a user is created, create a Stripe customer object for them.
 *
 * @see https://stripe.com/docs/payments/save-and-reuse#web-create-customer
 */
exports.createStripeCustomer = functions.auth.user().onCreate(async (user) => {
  const customer = await stripe.customers.create({ email: user.email });
  const intent = await stripe.setupIntents.create({
  customer: customer.id,
  });
  await admin.firestore().collection('stripe_customers').doc(user.uid).set({
    customer_id: customer.id,
    setup_secret: intent.client_secret,
  });
  return;
});

/**
 * When a user deletes their account, clean up after them
 */
exports.cleanupUser = functions.auth.user().onDelete(async (user) => {
  const dbRef = admin.firestore().collection('stripe_customers');
  const customer = (await dbRef.doc(user.uid).get()).data();
  await stripe.customers.del(customer.customer_id);
  // Delete the customers payments & payment methods in firestore.
  const snapshot = await dbRef
    .doc(user.uid)
    .collection('payment_methods')
    .get();
  snapshot.forEach((snap) => snap.ref.delete());
  await dbRef.doc(user.uid).delete();
  return;
});

/**
 * Check if a previous session of create listing wizard has been started
 * @return {boolen} - If true, inform client to alter UI state and handle this case
 */

exports.hasListingPendingStatus = functions.https.onCall(
  async (data, context) => {
    // Checking that the user is authenticated.
    if (!context.auth) {
      // Throwing an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError(
        'failed-precondition',
        'The function must be called ' + 'while authenticated.'
      );
    }

    // [START authIntegration]
    // Authentication user information is automatically added to the request.
    const uid = context.auth.uid;
    const name = context.auth.token.name || null;
    const picture = context.auth.token.picture || null;
    const email = context.auth.token.email || null;
    // [END authIntegration]

    try {
      // check for pending listing already in session (string)
      const userRef = db.collection('users').doc(uid);
      const doc = await userRef.get();
      const isPending = doc.data();
      let status;

      // return error 'new listing already started along with id
      if (doc.exists) {
        if (isPending.pendingListingId) {
          status = true;
        } else {
          status = false;
        }

        // return genListingId;
      }

      return status;

      //catch any other error and send message to handle on client
      // dont let proceed
    } catch (error) {
      functions.logger.log(`${uid} - hasListingPendingStatus`, error);
      // Re-throwing the error as an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError('unknown', error.message, error);
    }
  }
);

/**
 * Generate New Listing Id after accepting disclaimer in onboarding wizard
 *
 */
exports.preGenerateNewListingId = functions.https.onCall(
  async (data, context) => {
    // Checking that the user is authenticated.
    if (!context.auth) {
      // Throwing an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError(
        'failed-precondition',
        'The function must be called ' + 'while authenticated.'
      );
    }

    // [START authIntegration]
    // Authentication user information is automatically added to the request.
    const uid = context.auth.uid;
    const name = context.auth.token.name || null;
    const picture = context.auth.token.picture || null;
    const email = context.auth.token.email || null;
    // [END authIntegration]

    try {
      // check for pending listing already in session (string)
      const userRef = db.collection('users').doc(uid);

      // ask if user wants to continue or start over
      // do this on client, if they do, delete pending data and listing ID

      // if not, generate unique identifier serving as listing id
      const genListingId = await shortid();

      // add new listing Id to user document as newListingInProcess
      const isPending = await userRef.update({
        pendingListingId: genListingId,
      });

      //return newListingId with success
      return genListingId;

      //catch any other error and send message to handle on client
      // dont let proceed
    } catch (error) {
      functions.logger.log(`${uid} - preGenerateNewListingId`, error);
      // Re-throwing the error as an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError('unknown', error.message, error);
    }
  }
);

/**
 * Generate New Listing Id after accepting disclaimer in onboarding wizard
 *
 */
 exports.generateListingState = functions.https.onCall(
  async (data, context) => {
    // Checking that the user is authenticated.
    if (!context.auth) {
      // Throwing an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError(
        'failed-precondition',
        'The function must be called ' + 'while authenticated.'
      );
    }

    // response.set('Access-Control-Allow-Origin', '*');
    // [START authIntegration]
    // Authentication user information is automatically added to the request.
    const uid = context.auth.uid;
    // [END authIntegration]

    try {

      // if not, generate unique identifier serving as listing id
      const genListingId = await shortid();

      const defaultListingState = [{[genListingId]: 'payment'}]
      // check for pending listing already in session (string)
      //const userRef = await db.collection('listing_state').doc(uid).set(defaultListingState);
      await admin.firestore().collection('listing_state').doc(uid).set(
        { listingId: defaultListingState }
      );
      // add new listing Id to user document as newListingInProcess
      // const isPending = await userRef.update({
      //   pendingListingId: genListingId,
      // });

      //return newListingId with success
      return genListingId;

      //catch any other error and send message to handle on client
      // dont let proceed
    } catch (error) {
      functions.logger.log(`${uid} - preGenerateNewListingId`, error);
      // Re-throwing the error as an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError('unknown', error.message, error);
    }
  }
);

// this function activates free mode. see todo
 exports.requestStatusUpdate = functions.https.onCall(
  async (data, context) => {
    // Checking that the user is authenticated.
    if (!context.auth) {
      // Throwing an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError(
        'failed-precondition',
        'The function must be called ' + 'while authenticated.'
      );
    }

    // [START authIntegration]
    // Authentication user information is automatically added to the request.
    const uid = context.auth.uid;
    // [END authIntegration]

    try {

     // double check system if it is really in free mode
     // if not return an error
      const isPremium = await (admin.firestore().collection('private').doc('payment_mode')).get();
      const isFree = !isPremium.data().isPremium

      // we are assuming that this is the first listing they have created and 
      // id will be found on position 0 in array under listing_state db connection
      const listing_state = await (admin.firestore().collection('listing_state').doc(uid)).get();
      const listingObject = listing_state.data().listingId[0];
   
      const listingId = Object.keys(listingObject)[0];
      functions.logger.log(listingId);
      await admin.firestore().collection('listing_state').doc(uid).set(
        { listingId: [{[listingId]: 'address'}] }
      );

      // TODO potential issue
      // if somehow they already had a signed up multiple listings and this gets called,
      // it will erase all the old listings. 


      //catch any other error and send message to handle on client
      // dont let proceed
    } catch (error) {
      functions.logger.log(`${uid} - Verify Free Mode`, error);
      // Re-throwing the error as an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError('unknown', error.message, error);
    }
  }
);

// Create a new listing, verify identity, and process payment if applicable
exports.createNewListing = functions.https.onCall(async (data, context) => {
    // Checking that the user is authenticated.
    if (!context.auth) {
      // Throwing an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError(
        'failed-precondition',
        'The function must be called ' + 'while authenticated.'
      );
    }

    // Authentication / user information is automatically added to the request.

    const userId = context.auth.uid;

  try {

    // we are assuming that this is the first listing they have created and 
    // id will be found on position 0 in array under listing_state db connection
    const listing_state = await (admin.firestore().collection('listing_state').doc(userId)).get();
    const listingObject = listing_state.data().listingId[0];
    const listingId = Object.keys(listingObject)[0];


    functions.logger.log('photographyDate', data.photography);
    //Check out 5 digit sign code
    let signCode = await checkout();
    functions.logger.log('[signCode]', signCode);

    const showingID = await createListing(data, userId, listingId, signCode);

    await generateOnboardingTasks(showingID, listingId);

      await admin.firestore().collection('listing_state').doc(userId).set(
        { listingId: [{[listingId]: 'dashboard'}] }
      );



    return signCode;
  } catch (error) {
    functions.logger.log('[generalError]', error);
    //throw new functions.https.HttpsError('createNewListing', error.message, error)
  }

});

exports.testCoupon = functions.https.onCall(
  async (data, context) => {
let test = '123';

    const price = await stripe.prices.retrieve(
      'price_1JAmJjL66vySrkwRV5KjI3J2'
    );

  
    const CHARGE_AMOUNT_P1 = price.unit_amount;
    const CURRENCY = 'usd';
    const {error, coupon} =  await stripe.coupons.retrieve(
      'dfgdfgdfg'
    );
    try {

 
     

    
  
  return error;

    } catch (error) {
      //functions.logger.log(error);
      return error.type;

    }
  }
);

exports.addPaymentMethodDetailsVerifyFreeAccount = functions.https.onCall(
  async (data, context) => {
    // Checking that the user is authenticated.
    if (!context.auth) {
      // Throwing an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError(
        'failed-precondition',
        'The function must be called ' + 'while authenticated.'
      );
    }

    // [START authIntegration]
    // Authentication user information is automatically added to the request.
    const uid = context.auth.uid;
    const name = context.auth.token.name || null;
    const picture = context.auth.token.picture || null;
    const email = context.auth.token.email || null;
    //[END authIntegration]

    const { payment_method = null } = data;
    // const { payment_intent = null } = data;
    // let intent;

    //WHERE IF LEFT OFF
    //WHERE IF LEFT OFF
    //WHERE IF LEFT OFF
    //WHERE IF LEFT OFF
    //WHERE IF LEFT OFF

    //everything works but createListing is not generating and redirecting to showings page after form submittion
    //maybe removePendingListingId is causing issues

    try {
      // Look up the Stripe customer id.
      //const customer = (await snap.ref.parent.parent.get()).data().customer_id;
      const dbRef = admin.firestore().collection('stripe_customers');
      const customer = (await dbRef.doc(uid).get()).data();
      const paymentMethodRef = admin
        .firestore()
        .collection('stripe_customers')
        .doc(uid)
        .collection('payment_methods');
      // Create a charge using the pushId as the idempotency key
      // to protect against double charges.

      const paymentMethod = await stripe.paymentMethods.retrieve(
        payment_method
      );

      await paymentMethodRef.add({ paymentMethod });

      const intent = await stripe.setupIntents.create({
        customer: customer.customer_id,
      });

      await dbRef.doc(uid).set(
        {
          setup_secret: intent.client_secret,
        },
        { merge: true }
      );

      // // // Send the response to the client
      return paymentMethod;
    } catch (error) {
      // We want to capture errors and render them in a user-friendly way, while
      // still logging an exception with StackDriver
      functions.logger.log(error);
      throw new functions.https.HttpsError('unknown', error.message, error);
      //await snap.ref.set(payment, { merge: true });
      //await snap.ref.set({ ...error.payment_intent, errorMessage: userFacingMessage(error) }, { merge: true });
      //   await reportError(error, { user: context.params.userId });
    }
  }
);


exports.createStripePaymentCall = functions.https.onCall(
  async (data, context) => {
    // Checking that the user is authenticated.
    if (!context.auth) {
      // Throwing an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError(
        'failed-precondition',
        'The function must be called ' + 'while authenticated.'
      );
    }

    const CURRENCY = 'usd';

    // [START authIntegration]
    // Authentication user information is automatically added to the request.
    const uid = context.auth.uid;
    const name = context.auth.token.name || null;
    const picture = context.auth.token.picture || null;
    const email = context.auth.token.email || null;
    //[END authIntegration]

    const { payment_method = null } = data;
    const { payment_intent = null } = data;
    let intent;
    let coupon;
    try {

      const price = await stripe.prices.retrieve(
        'price_1IS4z7L66vySrkwR5C1cQ7Ha'
      );

// alsdkjflsadkjflkj
  
      if(data.coupon.length > 1) {
      coupon = await stripe.coupons.retrieve(
        data.coupon.toString()
      )
      updateStateToAddress(uid);
      intent = {};
      intent.status = 'succeeded'
      return generateResponse(intent)
      }

      // let discountAmount = (coupon.percent_off / 100) * price.unit_amount;
      // let charge = price.unit_amount - discountAmount;
  


      // Look up the Stripe customer id.
      functions.logger.log('uid', uid);
      functions.logger.log('payment', payment_method);
      //const customer = (await snap.ref.parent.parent.get()).data().customer_id;
      const dbRef = admin.firestore().collection('stripe_customers');
      const customer = (await dbRef.doc(uid).get()).data();

      // functions.logger.log('[customer]', charge);
      // Create a charge using the pushId as the idempotency key
      // to protect against double charges.

      //const idempotencyKey = context.params.pushId;
      if (payment_method) {
        // Create the PaymentIntent
        intent = await stripe.paymentIntents.create({
          amount: price.unit_amount,
          currency: CURRENCY,
          customer: customer.customer_id,
          payment_method,
          off_session: false,
          confirm: true,
          confirmation_method: 'manual',
        });
      } else if (payment_intent) {
        intent = await stripe.paymentIntents.confirm(payment_intent);
      }

      // Send the response to the client
      return generateResponse(intent);
    } catch (error) {
      
      // We want to capture errors and render them in a user-friendly way, while
      // still logging an exception with StackDriver
      functions.logger.log(error);
      throw new functions.https.HttpsError('unknown', error.message, error);
     
      //await snap.ref.set(payment, { merge: true });
      //await snap.ref.set({ ...error.payment_intent, errorMessage: userFacingMessage(error) }, { merge: true });
      //   await reportError(error, { user: context.params.userId });
    }
  }
);

exports.validateCoupon = functions.https.onCall(
  async (data, context) => {
    // Checking that the user is authenticated.
    if (!context.auth) {
      // Throwing an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError(
        'failed-precondition',
        'The function must be called ' + 'while authenticated.'
      );
    }

    // [START authIntegration]
    // Authentication user information is automatically added to the request.
    const uid = context.auth.uid;
    //[END authIntegration]

    try {
      // retrieve price of user sign up
      const price = await stripe.prices.retrieve(
        'price_1IS4z7L66vySrkwR5C1cQ7Ha'
      );

      // validate coupon code. will throw error if not valid
      let intent = {};
      const coupon = await stripe.coupons.retrieve(
        data.coupon.toString()
      );

      // calculate new price, update listing_state if charge = 0
      let discountAmount = (coupon.percent_off / 100) * price.unit_amount;
      let charge = price.unit_amount - discountAmount;
      // if (charge === 0) updateStateToAddress(uid);

      // return new price
      intent.status = 'succeeded'
      return charge 



      

  


      // Look up the Stripe customer id.
      functions.logger.log('uid', uid);
      functions.logger.log('payment', payment_method);
      //const customer = (await snap.ref.parent.parent.get()).data().customer_id;
      const dbRef = admin.firestore().collection('stripe_customers');
      const customer = (await dbRef.doc(uid).get()).data();

     
    } catch (error) {
      
  
      functions.logger.log(error);
      throw new functions.https.HttpsError('unknown', error.message, error);
     
    }
  }
);

/**
 * TODOOOO: Rename function to its actual use
 * When adding the payment method ID on the client,
 * this function is triggered to retrieve the payment method details.
 */
exports.addPaymentMethodDetailsAndCharge = functions.firestore
  .document('stripe_customers/{userId}/payments/{pushId}')
  .onCreate(async (snap, context) => {
    const uid = context.params.userId;

    try {

      // Create a new SetupIntent so the customer can add a new method next time.
      
         // if not return an error
         const customerIdRef = await (admin.firestore().collection('stripe_customers').doc(uid)).get();
         const customerId = customerIdRef.data().customer_id;
          const intent = await stripe.setupIntents.create({
            customer: customerId,
          });

          await admin.firestore().collection('stripe_customers').doc(uid).set({
            setup_secret: intent.client_secret,
          }, {merge: true});
     
      

    
      // TODO This command doesnt belong here bc it hurts reusability.
      // we are assuming that this is the first listing they have created and 
      // id will be found on position 0 in array under listing_state db connection
      const listing_state = await (admin.firestore().collection('listing_state').doc(uid)).get();
      const listingObject = listing_state.data().listingId[0];
   
      const listingId = Object.keys(listingObject)[0];
      functions.logger.log(listingId);
      await admin.firestore().collection('listing_state').doc(uid).set(
        { listingId: [{[listingId]: 'address'}] }
      );

      // TODO potential issue
      // if somehow they already had a signed up multiple listings and this gets called,
      // it will erase all the old listings. 


      // update listing state
      return;
    } catch (error) {
      // await snap.ref.set({ error: userFacingMessage(error) }, { merge: true });
      // await reportError(error, { user: context.params.userId });
      functions.logger.log(error)
    }
  });






// --------------------------------------------------------------
// HELPER FUNCTIONS----------------------------------------------
// --------------------------------------------------------------

// helper function for stripe payment
const generateResponse = (intent) => {
  // Note that if your API version is before 2019-02-11, 'requires_action'
  // appears as 'requires_source_action'.
  if (
    intent.status === 'requires_action' &&
    intent.next_action.type === 'use_stripe_sdk'
  ) {
    // Tell the client to handle the action
    return {
      requires_action: true,
      payment_intent_client_secret: intent.client_secret,
    };
  } else if (intent.status === 'succeeded') {
    // The payment didn’t need any additional actions and completed!
    // Handle post-payment fulfillment
    return {
      success: true,
    };
  } else {
    // Invalid status
    return {
      error: 'Invalid PaymentIntent status',
    };
  }
};

const createListing = async (values, userId, genListingId, signCode) => {
  const { homeAddress } = values;
  // format object to address
  const { streetNumber, streetName, city, state } = createAddressComponents(
    homeAddress.address_components
  );
  let showingId;

  try {
    //create and add setup information into database
    await db
      .collection('listings')
      .doc(genListingId)
      .set({
        fullAddress: homeAddress.formatted_address,
        signCode: signCode,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        id: genListingId,
        primaryOwnerId: userId,
        ...initialSetUpData(homeAddress.address_components),
      });

    await admin;

    // create example showing tied to fake account for tour/onboarding purposes
    showingId = await db.collection(`showings`).add({
      buyerUser: {
        displayName: 'Sample Showings Request',
        email: 'johndoe@example.com',
        id: 'D8PtcQwbkLgBYjigeUoTYP5xzoE2',
      },
      dateCreated: admin.firestore.FieldValue.serverTimestamp(),
      duration: 60,
      listingId: genListingId,
      cancelled: false,
      comment:
        'Excited to see your home. My mother lives down the road from you.',
      scheduled: admin.firestore.Timestamp.fromDate(new Date()),
      instructions: '',
      sellerUserId: userId,
      type: 'First Time Homebuyer',
      status: 'pending',
      isExample: true,
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
        isExample: true,
      });

    


    //atomically update listings array in [USER DOCUMENT]
    let userRef = db.collection('users').doc(userId);
    let arrUnion = await userRef.update({
      listings: admin.firestore.FieldValue.arrayUnion({
        id: genListingId,
        role: 'owner',
      }),
      defaultListingId: genListingId,
    });

    functions.logger.log('[showingId]', showingId.id);
  } catch (error) {
    functions.logger.log('[ERROR]', error);
  }

  return showingId.id;
};

const generateOnboardingTasks = async (showingID, listingId) => {
  // // [START ONBOARDING WIZARD DB ENTRIES]
  functions.logger.log('[showingID]', showingID);

    //add count to question tabbar to indicate action needs to be taken
    await db
      .collection('message_counter')
      .doc(listingId)
      .set({ questionCount: 1 }, { merge: true })


  let notificationRef = await admin
  .database()
  .ref(`notifications/${listingId}`);

  let interestChat = await admin
  .database()
  .ref(`interest_chat/${listingId}_D8PtcQwbkLgBYjigeUoTYP5xzoE2`);

  let chatOne = await interestChat.push();
  await chatOne.set({
    author: 'D8PtcQwbkLgBYjigeUoTYP5xzoE2',
    displayName: 'Example Buyer',
    message: '👋👋👋👋👋👋👋',
    photoURL: 'https://lh3.googleusercontent.com/a-/AAuE7mDnqbDP5hkjAMn-fLU6t2ShZ8zvGLpwcZkuz5ev',
    timestamp: admin.firestore.FieldValue.serverTimestamp(),

  });
  let chatTwo = await interestChat.push();
  await chatTwo.set({
   author: 'D8PtcQwbkLgBYjigeUoTYP5xzoE2',
    displayName: 'Example Buyer',
    message: 'Welcome, I am an example of an interested buyer.',
    photoURL: 'https://lh3.googleusercontent.com/a-/AAuE7mDnqbDP5hkjAMn-fLU6t2ShZ8zvGLpwcZkuz5ev',
    timestamp: admin.firestore.FieldValue.serverTimestamp(),

  });

  let chatThree = await interestChat.push();
  await chatThree.set({
   author: 'D8PtcQwbkLgBYjigeUoTYP5xzoE2',
    displayName: 'Example Buyer',
    message: 'You see this lead because I either subscribed to your home\'s updates or I have viewed you home in person.',
    photoURL: 'https://lh3.googleusercontent.com/a-/AAuE7mDnqbDP5hkjAMn-fLU6t2ShZ8zvGLpwcZkuz5ev',
    timestamp: admin.firestore.FieldValue.serverTimestamp(),

  });

  let chatFour = await interestChat.push();
  await chatFour.set({
   author: 'D8PtcQwbkLgBYjigeUoTYP5xzoE2',
    displayName: 'Example Buyer',
    message: 'Click view offer to see what an purchase offer looks like. Here you are able to negotiate, accept, or counter offer.',
    photoURL: 'https://lh3.googleusercontent.com/a-/AAuE7mDnqbDP5hkjAMn-fLU6t2ShZ8zvGLpwcZkuz5ev',
    timestamp: admin.firestore.FieldValue.serverTimestamp(),

  });

  let chatFive = await interestChat.push();
  await chatFive.set({
   author: 'D8PtcQwbkLgBYjigeUoTYP5xzoE2',
    displayName: 'Example Buyer',
    message: 'Don\'t worry about what you need to know after an offer is accepted. This platform will help nudge you along each step of the process.',
    photoURL: 'https://lh3.googleusercontent.com/a-/AAuE7mDnqbDP5hkjAMn-fLU6t2ShZ8zvGLpwcZkuz5ev',
    timestamp: admin.firestore.FieldValue.serverTimestamp(),

  });

  let chatSix = await interestChat.push();
  await chatSix.set({
   author: 'D8PtcQwbkLgBYjigeUoTYP5xzoE2',
    displayName: 'Example Buyer',
    message: 'To delete this example, go to profile and click unsubscribe.',
    photoURL: 'https://lh3.googleusercontent.com/a-/AAuE7mDnqbDP5hkjAMn-fLU6t2ShZ8zvGLpwcZkuz5ev',
    timestamp: admin.firestore.FieldValue.serverTimestamp(),

  });


  functions.logger.log('made it this far2')
  let showingNotifcationRef = await notificationRef.push();
  await showingNotifcationRef.set({
      data: {
          buyerType: 'Example Buyer',
          fullName: 'Sample Showings Request',
          scheduled: new Date(1000),
      },
      required: true,
      showingId: showingID,
      title: 'Showing Request',
      type: 1,
  });

  // home details notification
  let infoNotificationRef = await notificationRef.push();
  await infoNotificationRef.set({
    action: '/listing/information',
    actionType: 'route',
    description: 'Add home details, upload documents, add a front photo',
    required: true,
    title: 'Home Setup',
    buttonLabel: 'Setup Home',
    type: 3,
  });

  // booking photography add the task 

    let orderPhotosNotificationRef = await notificationRef.push();
    await orderPhotosNotificationRef.set({
      data: {
        heading:
          'Is "Professional Photography" necessary if I am selling the home myself?',
        content:
          'Thanks to the Internet, buyers select from several hundred properties—and narrow down to 2 or 3—in the matter of an hour, without ever leaving their desk.',
      },
      action: '/listing/photoAppointment',
      actionType: 'popup',
      description:
        ' Schedule Free Professional Photography Now. Great photography is essential to making your home stand out.',
      required: false,
      title: 'Schedule Photography',
      buttonLabel: 'Place Order',
      type: 3,
    });
  

  // showings settings notification
  let showingSettingsNotificationRef = await notificationRef.push();
  await showingSettingsNotificationRef.set({
    action: '/app/showings?settings=1',
    actionType: 'route',
    description: 'Select your showing availability in "showing settings"',
    title: 'Set Availability',
    buttonLabel: 'View Settings',
    type: 3,
    notificationId: 'showingSettings'
  });

  // showings settings notification
  let orderYardSign = await notificationRef.push();
  await orderYardSign.set({
    data: {
      heading:
        'Where would you like your sign delivered?',
      content:
        'Select Address',
    },
    action: '/listing/orderYardSign',
    actionType: 'popup',
    description:
      'Yard signs are included at no extra cost. Just select "take action" to choose a delivery address.',
    required: false,
    title: 'Yard Sign Delivery',
    buttonLabel: 'Place Order',
    type: 3,
  });

    functions.logger.log('holy moly')
    functions.logger.log('holy moly', listingId)
}

/**
 * Sanitize the error message for the user.
 */
function userFacingMessage(error) {
  return error.type
    ? error.message
    : 'An error occurred, developers have been alerted';
}
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
    'something',
  ];
  let addressObject = {};
  addressPartsArray.map(
    (part, index) => (addressObject[addressBreakDown[index]] = part.long_name)
  );
  return addressObject;
};

const updateStateToAddress = async (uid) => {
   // Create a new SetupIntent so the customer can add a new method next time.
      try {
         // if not return an error
         const customerIdRef = await (admin.firestore().collection('stripe_customers').doc(uid)).get();
         const customerId = customerIdRef.data().customer_id;
          const intent = await stripe.setupIntents.create({
            customer: customerId,
          });

          await admin.firestore().collection('stripe_customers').doc(uid).set({
            setup_secret: intent.client_secret,
          }, {merge: true});
     
      

    
      // TODO This command doesnt belong here bc it hurts reusability.
      // we are assuming that this is the first listing they have created and 
      // id will be found on position 0 in array under listing_state db connection
      const listing_state = await (admin.firestore().collection('listing_state').doc(uid)).get();
      const listingObject = listing_state.data().listingId[0];
   
      const listingId = Object.keys(listingObject)[0];
      functions.logger.log(listingId);
      await admin.firestore().collection('listing_state').doc(uid).set(
        { listingId: [{[listingId]: 'address'}] }
      );
      } catch (error) {
        functions.logger.log(error)
      }
        
}

