import Web3 from "web3";
import config from "config";
import tokenABI from "./interfaces/token.json";
import { web3 } from "./index";

var contract = web3.eth.contract(tokenABI).at(config.seeds_token_address);

export const getTokenInfo = async (req, res) => {

  const balanceOfSeeds = await contract.balanceOf.call(config.seeds_account_address);
  const totalSupply = await contract.totalSupply.call();

  return {
    balanceOfSeeds,
    totalSupply
  };
};
