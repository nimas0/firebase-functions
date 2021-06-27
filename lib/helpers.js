
/**Send email with a template via firestore extensions
 *
 * @param { object } admin firebase admin object
 * @param {email} email - the recepient
 *
 *
 */



module.exports.sendEmail = async ({ admin }, email, name, subject, template) => {
  return await admin
    .firestore()
    .collection('mail')
    .add({
      to: email,
      template: {
        name: 'ShowingCancelled',
        data: {
          buyerDisplayName: buyerUser.displayName,
          listingAddress: listing.fullAddress,
          cancelReason: cancelReason,
        },
      },
    });
};


module.exports.sendSMS = async ({ admin }, phoneNumber, userId, listingId, body) => {

  try {
    const writeData =  await admin
    .firestore()
    .collection('sms_noreply')
    .add({
     body,
     listingId,
     phoneNumber,
     userId
    });

    return writeData;

  } catch (error) {
    functions.logger.error('sendSMS-helper', error)
  }

 
};

const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};
