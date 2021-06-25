/* eslint-disable */
const admin = require('firebase-admin');
var serviceAccount = require('./service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://finding-spaces-73b23.firebaseio.com',
});



exports.onBoarding = require('./taskbar/onBoarding');
exports.payment = require('./newListing/stripe/processPaymentAndListing');
exports.test = require('./smsnoreply/index');
exports.callback = require('./smsnoreply/callback');
exports.adminTasksEmail = require('./lib/adminTasks');
exports.sellerMessageBulk = require('./lib/messages');
exports.proposals = require('./lib/proposals');
exports.verificationRequest = require('./lib/verificationRequest');
exports.test2 = require('./newListing/lib/makeWebIds');
exports.adminTasks = require('./adminTasks/index');
exports.newListing = require('./newListing/index');
exports.messageCounter = require('./interest/messageCounter');
exports.notifications = require('./notifications/index');

