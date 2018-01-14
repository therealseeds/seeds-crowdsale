import tx from 'ethereumjs-tx';
import winston from "winston";
import config from "config";
import tokenABI from "./interfaces/token.json";
import { web3 } from "./index";

var contract = web3.eth.contract(tokenABI).at(config.seeds_token_address);

export const getTokenInfo = async () => {

  const balanceOfSeeds = await contract.balanceOf.call(config.seeds_token_owner_address);
  const totalSupply = await contract.totalSupply.call();

  return {
    balanceOfSeeds,
    totalSupply
  };
};

export const sendTokensTo = (addressTo, totalSeedsUnits) => {

  const privateKey = new Buffer(config.seeds_token_owner_private_key, 'hex');
  const addressFrom = config.seeds_token_owner_address;

  const gasLimit = 100000;
  const gasPrice = web3.toWei(30, "gwei");

  try {
    const transferData = contract.transfer.getData(addressTo, totalSeedsUnits);

    const rawTx = {
      nonce: web3.toHex(web3.eth.getTransactionCount(addressFrom)),
      gasLimit: web3.toHex(gasLimit),
      gasPrice: web3.toHex(gasPrice),
      to: config.seeds_token_address,
      from: addressFrom,
      data: transferData
    };

    var transaction = new tx(rawTx);
    transaction.sign(privateKey);
    const serializedTx = transaction.serialize().toString('hex');

    const transactionHash = web3.eth.sendRawTransaction("0x" + serializedTx);
    winston.info(`Transaction ${transactionHash} initiated`);

    return { transactionHash };

  } catch (err) {
    winston.error(err);
    return { transactionHash: false, error: err.message };
  }
};
