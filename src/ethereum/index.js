import Web3 from "web3";
import ProviderEngine from "web3-provider-engine";
import WalletSubprovider from "web3-provider-engine/subproviders/wallet";
import Web3Subprovider from "web3-provider-engine/subproviders/web3";
import config from "config";
// const WalletSubprovider = require('ethereumjs-wallet/provider-engine');
const FilterSubprovider = require('web3-provider-engine/subproviders/filters.js');

const web3HttpProvider = new Web3.providers.HttpProvider(config.ethereum_node_url);
export const web3 = new Web3(web3HttpProvider);
//
// var engine = new ProviderEngine();
// engine.addProvider(new FilterSubprovider());
// engine.addProvider(new Web3Subprovider(web3HttpProvider);

// engine.addProvider(new WalletSubprovider(wallet, {}));
// engine.start(); // Required by the provider engine.
