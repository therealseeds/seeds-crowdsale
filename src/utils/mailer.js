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
  message.from = '"Rachel at Seeds" <team@playseeds.com>';

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
    subject: 'Your SEEDS Tokens purchase is confirmed!',
    html: fs.readFileSync(__dirname + '/emails/purchase-confirmed.html')
  };

  await sendMail(message);
};

export const sendPurchaseFailedEmail = async (receiver) => {
  let message = {
    to: receiver,
    subject: "Your SEEDS Tokens purchase failed - but we're looking into it!",
    html: fs.readFileSync(__dirname + '/emails/purchase-failed.html')
  };

  await sendMail(message);
};

export const sendRetrieveConfirmedEmail = async (receiver) => {
  let message = {
    to: receiver,
    subject: 'Your SEEDS Tokens have been sent!',
    html: fs.readFileSync(__dirname + '/emails/retrieve-confirmed.html')
  };

  await sendMail(message);
};

export const sendRetrieveFailedEmail = async (receiver) => {
  let message = {
    to: receiver,
    subject: "Your SEEDS Tokens retrieval failed - but we're looking into it!",
    html: fs.readFileSync(__dirname + '/emails/retrieve-failed.html')
  };

  await sendMail(message);
};

export const sendVerifyEmail = async (receiver, token) => {
  const html = fs.readFileSync(__dirname + '/emails/verify-email.html', "utf8");
  let message = {
    to: receiver,
    subject: "SEEDS - verify your email address",
    html: html.replace('REPLACE_TOKEN', token)
  };

  await sendMail(message);
};
