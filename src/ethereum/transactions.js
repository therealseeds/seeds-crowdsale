import winston from "winston";
import config from "config";
import { web3 } from "./index";


const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

export const transactionStatus = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  FAILED: "failed",
  COMPLETED: "completed",
};

export const validateTransaction = async (transactionHash) => {

  const transaction = web3.eth.getTransaction(transactionHash);

  if (!transaction.blockNumber) {
    winston.info(`Transaction ${transactionHash} still pending`);
    await snooze(10000); // Sleep for 5 seconds
    return Promise.resolve(validateTransaction(transactionHash));
  } else {

    const transactionReceipt = web3.eth.getTransactionReceipt(transactionHash);
    const status = web3.toDecimal(transactionReceipt.status) == 0 ? transactionStatus.FAILED : transactionStatus.CONFIRMED;
    winston.info(`Transaction ${transactionHash} status: ${status}`);
    return Promise.resolve(status);
  }
};
