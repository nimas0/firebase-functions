const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();

exports.deleteUserData = require('./deleteUserData');
exports.signInventory = require('./signInventory/triggers');





// if (!error) {
//     // remove any global state from the formik status method
//     props.setStatus('');
//     // after creating payment, store id into formik to submit to server firebase function call
//     const { id } = paymentMethod;
//     console.log('id', id);
//     await props.setSubmitting(true);

//     await props
//        .pay({ payment_method: id })
//        .then((results) => handleServerResponse(results.data))
//        .then((confirmed) => props.nextStep())
//        .catch((error) => props.setStatus(error.message));
//     // console.log(results);
//     await props.setFieldValue('listingId', props.listingId);
//     await props.submitForm();
//     // await props.setSubmitting(false);
//  } else {
//     console.log('[error]', error);
//     props.setStatus(error.message);
//     await props.setSubmitting(false);
//  }
// }