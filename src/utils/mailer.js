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
  message.from = '"Rachel Cook" <team@playseeds.com>';

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
    subject: 'Your Seeds Tokens purchase is confirmed! Yay!',
    html: fs.readFileSync(__dirname + '/emails/purchase-confirmed.html')
  };

  await sendMail(message);
};

export const sendPurchaseFailedEmail = async (receiver) => {
  let message = {
    to: receiver,
    subject: "Unfortunately your Seeds Tokens purchase failed - but we're looking into it!",
    html: fs.readFileSync(__dirname + '/emails/purchase-failed.html')
  };

  await sendMail(message);
};

export const sendRetrieveConfirmedEmail = async (receiver) => {
  let message = {
    to: receiver,
    subject: 'Your Seeds Tokens have been sent!',
    html: fs.readFileSync(__dirname + '/emails/retrieve-confirmed.html')
  };

  await sendMail(message);
};

export const sendRetrieveFailedEmail = async (receiver) => {
  let message = {
    to: receiver,
    subject: "Unfortunately your Seeds Tokens retrieval failed - but we're looking into it!",
    html: fs.readFileSync(__dirname + '/emails/retrieve-failed.html')
  };

  await sendMail(message);
};

export const sendRedeemSuccessEmail = async (receiver) => {
  let message = {
    to: receiver,
    subject: 'Your Needs Request has been activated!',
    html: fs.readFileSync(__dirname + '/emails/redeem-confirmed.html')
  };

  await sendMail(message);
};

export const sendRedeemFailedEmail = async (receiver, uuid) => {

  const html = fs.readFileSync(__dirname + '/emails/redeem-failed.html', "utf8")
    .replace('[UUID]', uuid);

  let message = {
    to: receiver,
    subject: "Unfortunately your Seeds Tokens redemption failed :(",
    html
  };

  await sendMail(message);
};

export const sendVerifyEmail = async (receiver, token, redirectTo) => {

  if (!redirectTo || redirectTo == '/') {
    redirectTo = 'index';
  }

  const html = fs.readFileSync(__dirname + '/emails/verify-email.html', "utf8")
    .replace('REPLACE_TOKEN', token)
    .replace('REDIRECT_TO', redirectTo);

  let message = {
    to: receiver,
    subject: "Please verify your email to complete your sign-up at Seeds :D",
    html
  };

  await sendMail(message);
};

export const sendResetPasswordEmail = async (receiver, token) => {

  const html = fs.readFileSync(__dirname + '/emails/reset-password.html', "utf8")
    .replace('REPLACE_TOKEN', token);

  let message = {
    to: receiver,
    subject: "Seeds Tokens Password Reset",
    html
  };

  await sendMail(message);
};
