/* eslint-disable */
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});
var serviceAccount = require('./service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://finding-spaces-73b23.firebaseio.com',
});

exports.taskbar = require('./taskbar/index');
exports.payment = require('./newListing/stripe/processPaymentAndListing');
exports.adminTasksEmail = require('./lib/adminTasks');
exports.proposals = require('./lib/proposals');
exports.verificationRequest = require('./lib/verificationRequest');
exports.adminTasks = require('./adminTasks/index');
exports.newListing = require('./newListing/index');
exports.notifications = require('./notifications/index');
// exports.messageCounter = require('./interest/messageCounter');
// exports.test2 = require('./newListing/lib/makeWebIds');
// exports.sellerMessageBulk = require('./lib/messages');
