import Web3 from "web3";
import config from "config";
import crowdsaleABI from "./crowdsale.json";

var web3 = new Web3(new Web3.providers.HttpProvider(config.ethereum_node_url));
var contract = new web3.eth.Contract(crowdsaleABI, config.crowdsale_address);

export const getCrowdsaleProgressInfo = async (req, res) => {

  // const totalRaisedInWei = await contract.methods.totalRaisedInWei().call();
  const deadline = await contract.methods.deadline().call();
  const totalSdsUnits = await contract.methods.totalSdsUnits().call();
  const availableSdsUnits = await contract.methods.availableSdsUnits().call();

  // const totalRaisedInEth = totalRaisedInWei / config.ether;
  // let percentageCompleted = 100 - (availableSdsUnits * 100 / totalSdsUnits);

  return {
    // totalRaised: totalRaisedInEth,
    deadline: deadline * 1000, // to milliseconds
    // percentageCompleted,
    totalSdsUnits,
    availableSdsUnits
  };
};

export const getCrowdsalePriceInfo = async (req, res) => {

  const priceOfUnitInWei = await contract.methods.priceOfUnitInWei().call();
  const priceInEth = priceOfUnitInWei * config.sds / config.ether;

  return {
    price: priceInEth
  };
};
