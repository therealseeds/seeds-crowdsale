import bip39 from "bip39";
import hdkey from "ethereumjs-wallet/hdkey";
import config from "config";
import { web3 } from "./index";

// const mnemonic = bip39.generateMnemonic();
const seed = bip39.mnemonicToSeed(config.seeds_mnemonic);
const hdwallet = hdkey.fromMasterSeed(seed);

export const getWalletAddress = (index) => {
  const path = `m/44'/60'/0'/0/${index}`;
  const wallet = hdwallet.derivePath(path).getWallet();
  return "0x" + wallet.getAddress().toString("hex");
  // console.log(`wallet ${index} address: ` + address);
  // console.log(`wallet ${index} private key: ` + wallet.getPrivateKey().toString("hex"));
};

export const getWalletBalance = (address) => {
  const balanceInWei = web3.eth.getBalance(address);
  return balanceInWei.toNumber() / config.ether;
};
