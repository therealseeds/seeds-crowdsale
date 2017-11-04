import { IncomingWebhook } from '@slack/client';
import winston from "winston";

const slackWebhook = new IncomingWebhook("https://hooks.slack.com/services/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");
const sendSlackMessage = async (message) => {
  try {
    slackWebhook.send(message);
  } catch (err) {
    winston.error(err);
  }
};

export const sendTransactionStatusSlack = (transactionHash, status) => sendSlackMessage(`Transaction ${transactionHash}: ${status}`);
