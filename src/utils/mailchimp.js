import Mailchimp from 'mailchimp-api-v3';
import config from 'config';

const mailchimp = new Mailchimp(config.mailchimp.apiKey);

export const addToMailingList = async (email) => {

  const user = {
    email_address: email ,
    email_type: "html",
    status: "subscribed"
  };

  mailchimp.post({
    path : `/lists/${config.mailchimp.listID}`,
    body: {
      members: [ user ],
      update_existing: false
    }
  })
  .catch((err) => console.log("Error: " + err));
}
