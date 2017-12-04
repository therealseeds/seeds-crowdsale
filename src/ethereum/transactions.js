import abiDecoder from 'abi-decoder';
import winston from "winston";
import config from "config";
import { web3 } from "./index";
import tokenABI from "./interfaces/token.json";


const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

export const transactionStatus = {
  NOT_FOUND: "not_found",
  PENDING: "pending",
  CONFIRMED: "confirmed",
  FAILED: "failed",
  COMPLETED: "completed",
  VALID: "valid",
  NOT_VALID: "not_valid",
};

export const validateTransaction = async (transactionHash) => {

  try {

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
  } catch (err) {
    winston.info(`Transaction ${transactionHash} not found`);
    return Promise.resolve(transactionStatus.NOT_FOUND);
  }
};

export const validateOneSeedsTransaction = async (transactionHash) => {

  try {

    const transaction = web3.eth.getTransaction(transactionHash);

    if (!transaction.blockNumber) {
      winston.info(`Transaction ${transactionHash} still pending`);
      await snooze(10000); // Sleep for 5 seconds
      return Promise.resolve(validateTransaction(transactionHash));
    } else {

      const transactionReceipt = web3.eth.getTransactionReceipt(transactionHash);
      if (web3.toDecimal(transactionReceipt.status) == 0) {
        winston.info(`Transaction ${transactionHash} status: ${transactionStatus.FAILED}`);
        return Promise.resolve(transactionStatus.FAILED);
      }

      abiDecoder.addABI(tokenABI);
      const decodedData = abiDecoder.decodeMethod(transaction.input);

      if (transaction.to.toLowerCase() !== config.seeds_token_address.toLowerCase()
        || decodedData.name !== "transfer"
        || decodedData.params[0].value.toLowerCase() != config.seeds_token_receiver_address.toLowerCase()
        || decodedData.params[1].value != config.sds
      ) {
        return Promise.resolve(transactionStatus.NOT_VALID);
      } else {
        return Promise.resolve(transactionStatus.VALID);
      }
    }
  } catch (err) {
    winston.info(`Transaction ${transactionHash} not found`);
    return Promise.resolve(transactionStatus.NOT_FOUND);
  }
};
