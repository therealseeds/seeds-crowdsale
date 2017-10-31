import config from "config";
import { withdrawFromWallet } from "api/ethereum/wallets";
import { validateTransaction } from "api/ethereum/transactions";
import { getUser, addPendingPurchase } from "api/db";

export default async (req, res) => {

  if (!req.session.email) {
    return res.redirect("/?signin=true&errorMessage=badInput");
  }

  const user = await getUser(req.session.email);
  const { transactionHash, balance } = withdrawFromWallet(user.walletID, user.walletAddress);

  if (!transactionHash) {
    return res.redirect("/contribute?errorMessage=transactionFailed");
  }

  const price = getCurrentPrice();
  addPendingPurchase(req.session.email, price, balance, transactionHash);

  validateTransaction(transactionHash);

  return res.redirect("/thanks");
}

const getCurrentPrice = () => {
  const price = config.initialPriceInWei * config.sds / config.ether;
  return price * (100 - config.presaleDiscount) / 100;
};
