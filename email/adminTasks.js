const functions = require('firebase-functions');
const admin = require('firebase-admin');
var { google } = require('googleapis');
const serviceAccount = require('../service-account.json');
const spreadsheetId = '1Dhjbwb-m07zVR5Zw8JT3FznE2kj7NqQzjjcg_AEU0cg';

// sendAdminTaskEmail and Add to spreadsheet
exports.sendAdminTaskEmail = functions.firestore
  .document('adminTasks/{adminTaskId}')
  .onCreate(async (snap, context) => {
    const { type, data, priority } = snap.data();

    const sheets = google.sheets('v4');

    const jwtClient = new google.auth.JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'], // read and write sheets
    });

    const jwtAuthPromise = jwtClient.authorize();

    try {
      if (type === 'resume') {
        const compose = await admin
          .firestore()
          .collection('mail')
          .add({
            to: 'support@findingspaces.com',
            message: {
              subject: `${priority.toUpperCase()} // ${capitalize(type)}`,
              html: convertDataToHtml(data),
            },
          });

        const { terms, survey, ...rest } = data;
        const dataToArrayRemoveTermsLastItem = convertDataToArray(rest);
        return sheets.spreadsheets.values.append(
          {
            spreadsheetId: spreadsheetId,
            range: 'Resumes',
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            resource: {
              values: [[...dataToArrayRemoveTermsLastItem]],
            },
            auth: jwtClient,
          },
          (err, response) => {
            if (err) return functions.logger.error(err);
          }
        );
      }
      functions.logger.log('data1', data);

      if (type === 'photoAppointment') {
        const { time, photography, userId, ...rest } = data;
        const dataToArrayRemoveTermsLastItem = convertDataToArray(rest);

        let userRef = admin.firestore().collection('users').doc(userId);
        const user = await userRef.get();
        const { displayName, number } = user.data();

        functions.logger.log('data222', user.data());

        const compose = await admin
          .firestore()
          .collection('mail')
          .add({
            to: 'support@findingspaces.com',
            message: {
              subject: `${priority.toUpperCase()} // ${capitalize(type)}`,
              html: convertDataToHtml({ ...data, displayName, number, userId }),
            },
          });

        return sheets.spreadsheets.values.append(
          {
            spreadsheetId: spreadsheetId,
            range: 'PhotoAppointments',
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            resource: {
              values: [
                [
                  displayName,
                  number,
                  ...dataToArrayRemoveTermsLastItem,
                  photography,
                  time,
                  userId,
                ],
              ],
            },
            auth: jwtClient,
          },
          (err, response) => {
            if (err) return functions.logger.error(err);
          }
        );
      }
    } catch (error) {
      functions.logger.log(error);
    }
  });

// helpers

const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const convertDataToHtml = (data) => {
  //convert object keys to array
  var k = Object.keys(data);
  //convert object values to array
  var v = Object.values(data);

  const listItems = k.map((item, index) => {
    return `<br><b>${capitalize(item)}<b/>: ${v[index]} <br/>`;
  });

  return `${listItems.join('')}`;
};

const convertDataToArray = (data) => {
  //convert object values to array
  var v = Object.values(data);

  return v;
};

const sortObjectByKey = (unorderedObject) => {
  console.log(JSON.stringify(unorderedObject));
  // → '{"b":"foo","c":"bar","a":"baz"}'

  const ordered = Object.keys(unorderedObject)
    .sort()
    .reduce((obj, key) => {
      obj[key] = unorderedObject[key];
      return obj;
    }, {});

  return ordered;
};

// sendAdminTaskEmail and Add to spreadsheet ... no longer needed bc i have the spreadsheet up to do and now synced to every new entry
// exports.testAdminTaskEmail = functions.firestore
//   .document('adminTasks/{adminTaskId}')
//   .onCreate(async (snap, context) => {

//     const { type, data, priority } = snap.data();
//     const { terms, survey, ...rest } = data;
//     const sheets = google.sheets('v4');

//     const jwtClient = new google.auth.JWT({
//       email: serviceAccount.client_email,
//       key: serviceAccount.private_key,
//       scopes: ['https://www.googleapis.com/auth/spreadsheets'], // read and write sheets
//     });

//     const jwtAuthPromise = jwtClient.authorize();

//     try {
//       // Bring in primary user email tied to listing
//       const listingRef = admin.firestore().collection('adminTasks');
//       const snapshot = await listingRef.where('type', '==', 'resume').get();

//       if (snapshot.empty) {
//         functions.logger.log('No matching documents.');
//         return;
//       }

//       let batch = [];

//       // add callback data to
//       snapshot.forEach(async (doc) => {
//         const resumeSubmittion = doc.data();

//         const { terms, file = null, survey, ...rest } = resumeSubmittion.data;
//         const dataToArrayRemoveTermsLastItem = convertDataToArray(rest);

//         batch.push(dataToArrayRemoveTermsLastItem);
//         functions.logger.log('AdminTask', dataToArrayRemoveTermsLastItem);
//         // functions.logger.log('resumeSubmittion', '=>', resumeSubmittion.data);
//       });

//       functions.logger.log('batch', '=>', batch);
//       await sheets.spreadsheets.values.append(
//         {
//           spreadsheetId: spreadsheetId,
//           range: 'Resumes',
//           valueInputOption: 'RAW',
//           insertDataOption: 'INSERT_ROWS',
//           resource: {
//             values: [...batch],
//           },
//           auth: jwtClient,
//         },
//         (err, response) => {
//           if (err) return functions.logger.error(err);
//         }
//       );
//     } catch (error) {
//       functions.logger.log(error);
//     }
//   });
