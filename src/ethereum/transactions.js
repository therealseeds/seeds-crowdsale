import winston from "winston";
import config from "config";
import { web3 } from "./index";
import { updatePurchase } from "api/db";

const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

export const validateTransaction = async (transactionHash) => {

  const transaction = web3.eth.getTransaction(transactionHash);

  if (!transaction.blockNumber) {
    winston.info(`Transaction ${transactionHash} still pending`);
    await snooze(5000); // Sleep for 5 seconds
    validateTransaction(transactionHash);
  } else {

    const transactionReceipt = web3.eth.getTransactionReceipt(transactionHash);
    const status = web3.toDecimal(transactionReceipt.status) == 0 ? "failed" : "confirmed" ;
    winston.info(`Transaction ${transactionHash} status: ${status}`);
    updatePurchase(transactionHash, status);
  }
};
