/**Send email with a template via firestore extensions
 *
 * @param { object } admin firebase admin object
 * @param {email} email - the recepient
 *
 *
 */

export const sendEmail = async ({ admin }, email, name, subject, template) => {
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

const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};
