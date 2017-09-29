import Web3 from "web3";
// import util from 'ethereumjs-util';
// import tx from 'ethereumjs-tx';
// import lightwallet from 'eth-lightwallet';
import config from "config";
import { sendResponseData } from "api/controllers";
import crowdsaleABI from "api/interfaces/crowdsale.json";

// var txutils = lightwallet.txutils;

var web3 = new Web3(new Web3.providers.HttpProvider(config.ethereum_node_url));
var contract = new web3.eth.Contract(crowdsaleABI, config.crowdsale_address);

const state = [
  "Fundraising", // Initial state
  "Failed", // Failed reaching the minimum target
  "Successful", // Completed but not transfered the fund to the funders
  "Closed" // All completed
]

export const crowdSale = async (req, res) => {

  const stateCode = await contract.methods.state().call();
  const totalRaised = await contract.methods.totalRaised().call();
  const priceInWei = await contract.methods.priceInWei().call();

  const data = {
    "state": state[stateCode],
    "totalRaised": totalRaised,
    "priceInWei": priceInWei
  };

  return sendResponseData(res, 200, data);
};
