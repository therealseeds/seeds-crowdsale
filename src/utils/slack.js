import { IncomingWebhook } from '@slack/client';
import winston from "winston";
import config from "config";


const slackWebhook = new IncomingWebhook(config.slack.webhook);
const sendSlackMessage = async (message) => {

  if (!config.slack.sendSlackMessage) {
    return Promise.resolve();
  }

  try {
    slackWebhook.send(message);
  } catch (err) {
    winston.error(err);
  }
};

export const sendTransactionStatusSlack = (transactionHash, status, context) => sendSlackMessage(`${context} transaction ${transactionHash}: ${status}`);

export const sendTransactionErrorSlack = (error, context, email) => sendSlackMessage(`${context} transaction for user ${email}: ${error}`);
