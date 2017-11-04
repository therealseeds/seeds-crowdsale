import nodemailer from 'nodemailer';
import sesTransport from 'nodemailer-ses-transport';
import winston from "winston";
import config from "config";


const transport = nodemailer.createTransport(sesTransport({
    accessKeyId: config.email.sesAccessKeyId,
    secretAccessKey: config.email.sesSecretAccessKey,
    rateLimit: 14
}));

const sendMail = async (message) => {
  message.from = message.sender = 'automated@playseeds.com';

  if (!config.email.sendEmails) {
    return Promise.resolve();
  }

  try {
    await transport.sendMail(message);
    winston.info(`Email sent to ${message.to}`);
  } catch (err) {
    winston.error("Error - send email: ", err);
  }
}

export const sendPurchaseConfirmedEmail = async (receiver, retrieveLink) => {
  let message = {
    to: receiver,
    subject: 'Seeds - purchase confirmed',
    html: 'Your transaction was successful and your purchase is confirmed!' +
           `<br/><br/>Now you can retrieve your Seeds Tokens <a href="http://localhost:3000/retrieve">here</a>` +
           '<br/><br/>Thanks,<br/>Seeds team',
  };

  await sendMail(message);
}
