// var bip39 = require("bip39");
// var hdkey = require('ethereumjs-wallet/hdkey');
// // const WalletSubprovider = require('ethereumjs-wallet/provider-engine');
// var ProviderEngine = require("web3-provider-engine");
//
// var WalletSubprovider = require('web3-provider-engine/subproviders/wallet.js');
// // const FilterSubprovider = require('web3-provider-engine/subproviders/filters.js');
// var Web3Subprovider = require("web3-provider-engine/subproviders/web3.js");
// var Web3 = require("web3");
//
// // Get our mnemonic and create an hdwallet
// // const mnemonic = bip39.generateMnemonic();
// const mnemonic = "parent wrestle vocal museum idea screen open between wrap guide input bridge";
// const seed = bip39.mnemonicToSeed(mnemonic);
// const hdwallet = hdkey.fromMasterSeed(seed);
//
// const index = "0";
// const path = `m/44'/60'/0'/0/${index}`;
// const wallet = hdwallet.derivePath(path).getWallet();
// const address = "0x" + wallet.getAddress().toString("hex");
//
// console.log(`wallet ${index} address: ` + address);
// console.log(`wallet ${index} private key: ` + wallet.getPrivateKey().toString("hex"));
//
// var providerUrl = "https://rinkeby.infura.io";
// var engine = new ProviderEngine();
//
// // engine.addProvider(new FilterSubprovider());
// engine.addProvider(new WalletSubprovider(wallet, {}));
// engine.addProvider(new Web3Subprovider(new Web3.providers.HttpProvider(providerUrl)));
// engine.start(); // Required by the provider engine.

export default (index) => `test-wallet${index}`;
