const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.sendVerificationRequest = functions.firestore
  .document('adminTasks/{adminTaskId}')
  .onCreate(async (snap, context) => {
    const verification = snap.data();
    const FINDINGSPACESEMAIL = 'support@findingspaces.com';

    // return if event is not a verificaiton request
    if (verification.data.verificationication === null)
      functions.logger.log('verification null');
    if (verification.data.verification === null || false) return;
    if (verification.data.verification.userId === null) return;

    try {
      functions.logger.log('got this far');
      functions.logger.log('verification', verification);
      functions.logger.log('data', verification.data.verification);
      functions.logger.log('loanType', verification.data.verification.userId);
      const buyerRef = admin.firestore().collection('users');
      //extract data from users verification field from user collection
      const buyerDoc = await buyerRef
        .doc(verification.data.verification.userId)
        .get();
      functions.logger.log('got this far again1');
      const buyer = buyerDoc.data();
      functions.logger.log('buyer', buyer);
      functions.logger.log('displayName', buyer.displayName);
      functions.logger.log('got this far again2');

      const compose = await admin
        .firestore()
        .collection('mail')
        .add({
          to: FINDINGSPACESEMAIL,
          subject: 'Admin Task Alert: Verification Request',
          template: {
            name: 'verificationRequest',

            data: {
              displayName: buyer.displayName,
              verifType: buyer.verification.verifType,
              userId: verification.data.verification.userId,
              amount: buyer.verification.amount,
              documentURL: buyer.verification.documentURL,
              status: buyer.verification.status,
              loanType: buyer.verification.loanType,
            },
          },
        });

      functions.logger.log('got this far 2');
      functions.logger.log(compose);
    } catch (error) {
      functions.logger.log('new verification ref', error);
    }
  });
