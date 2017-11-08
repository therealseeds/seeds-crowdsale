import nodemailer from 'nodemailer';
import sesTransport from 'nodemailer-ses-transport';
import winston from "winston";
import fs from "fs";
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
};

export const sendPurchaseConfirmedEmail = async (receiver) => {
  let message = {
    to: receiver,
    subject: 'Seeds - purchase confirmed',
    html: fs.readFileSync(__dirname + '/emails/purchase-confirmed.html')
  };

  await sendMail(message);
};

export const sendPurchaseFailedEmail = async (receiver) => {
  let message = {
    to: receiver,
    subject: 'Seeds - purchase failed',
    html: fs.readFileSync(__dirname + '/emails/purchase-failed.html')
  };

  await sendMail(message);
};

export const sendRetrieveConfirmedEmail = async (receiver) => {
  let message = {
    to: receiver,
    subject: 'Seeds - Tokens retrieved successfully',
    html: fs.readFileSync(__dirname + '/emails/retrieve-confirmed.html')
  };

  await sendMail(message);
};

export const sendRetrieveFailedEmail = async (receiver) => {
  let message = {
    to: receiver,
    subject: 'Seeds - Tokens retrieval failed',
    html: fs.readFileSync(__dirname + '/emails/retrieve-failed.html')
  };

  await sendMail(message);
};
