import Web3 from "web3";
import config from "config";
import tokenABI from "./token.json";

var web3 = new Web3(new Web3.providers.HttpProvider(config.ethereum_node_url));
var contract = new web3.eth.Contract(tokenABI, config.seeds_token_address);

export const getTokenInfo = async (req, res) => {

  const balanceOfSeeds = await contract.methods.balanceOf(config.seeds_account_address).call();
  const totalSupply = await contract.methods.totalSupply().call();

  return {
    balanceOfSeeds,
    totalSupply
  };
};
