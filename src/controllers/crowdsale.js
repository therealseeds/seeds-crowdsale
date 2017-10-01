import Web3 from "web3";
import config from "config";
import crowdsaleABI from "api/interfaces/crowdsale.json";

var web3 = new Web3(new Web3.providers.HttpProvider(config.ethereum_node_url));
var contract = new web3.eth.Contract(crowdsaleABI, config.crowdsale_address);

export const crowdsale = async (req, res) => {

  const totalRaisedInWei = await contract.methods.totalRaisedInWei().call();
  const priceOfUnitInWei = await contract.methods.priceOfUnitInWei().call();
  const deadline = await contract.methods.deadline().call();
  const totalSdsUnits = await contract.methods.totalSdsUnits().call();
  const availableSdsUnits = await contract.methods.availableSdsUnits().call();

  const priceInEth = priceOfUnitInWei / config.ether * config.sds;
  const totalRaisedInEth = totalRaisedInWei / config.ether;
  const percentageCompleted = ((100 - (availableSdsUnits * 100 / totalSdsUnits)) / 100).toFixed(2);

  const data = {
    // state: state[stateCode],
    totalRaised: totalRaisedInEth,
    price: priceInEth,
    deadline: deadline * 1000, // to milliseconds
    percentageCompleted
  };

  res.render('index', data);
};
