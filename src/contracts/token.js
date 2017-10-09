import Web3 from "web3";
import config from "config";
import tokenABI from "./token.json";

var web3 = new Web3(new Web3.providers.HttpProvider(config.ethereum_node_url));
var contract = web3.eth.contract(tokenABI).at(config.seeds_token_address);

export const getTokenInfo = async (req, res) => {

  const balanceOfSeeds = await contract.balanceOf.call(config.seeds_account_address);
  const totalSupply = await contract.totalSupply.call();

  return {
    balanceOfSeeds,
    totalSupply
  };
};
