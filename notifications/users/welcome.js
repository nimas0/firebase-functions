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
