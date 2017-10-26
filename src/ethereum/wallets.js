import bip39 from "bip39";
import hdkey from "ethereumjs-wallet/hdkey";
import WalletSubprovider from "ethereumjs-wallet/provider-engine";
import tx from 'ethereumjs-tx';
import config from "config";
import { web3 } from "./index";

// const mnemonic = bip39.generateMnemonic();
const seed = bip39.mnemonicToSeed(config.seeds_mnemonic);
const hdwallet = hdkey.fromMasterSeed(seed);

const getWallet = (index) => {
  const path = `m/44'/60'/0'/0/${index}`;
  return hdwallet.derivePath(path).getWallet();
};

export const getWalletAddress = (index) => {
  const wallet = getWallet(index);
  return "0x" + wallet.getAddress().toString("hex");
  // console.log(`wallet ${index} address: ` + address);
  // console.log(`wallet ${index} private key: ` + wallet.getPrivateKey().toString("hex"));
};

export const getWalletBalance = (address) => {
  const balanceInWei = web3.eth.getBalance(address);
  return balanceInWei.toNumber() / config.ether;
};

export const getWalletSubProvider = (index) => {
  const wallet = getWallet(index);
  return new WalletSubprovider(wallet, {});
};

export const withdrawFromWallet = (index, address) => {

  const balance = web3.eth.getBalance(address);
  if (balance == 0) {
    return false;
  }

  const wallet = getWallet(index);
  const privateKey = wallet.getPrivateKey();

  const gasLimit = 21000;
  const gasPrice = web3.toWei(20, "gwei");
  const value = balance - (gasLimit * gasPrice) ;

  const rawTx = {
    nonce: web3.toHex(web3.eth.getTransactionCount(address)),
    gasLimit: web3.toHex(gasLimit),
    gasPrice: web3.toHex(gasPrice),
    to: config.seeds_wallet_address,
    from: address,
    value: web3.toHex(value)
  };

  console.log(rawTx);

  var transaction = new tx(rawTx);
  transaction.sign(privateKey);
  var serializedTx = transaction.serialize().toString('hex');

  web3.eth.sendRawTransaction("0x" + serializedTx, function(err, transactionHash) {
    console.log(transactionHash);
    console.log(err);
  });

  return true;

};
