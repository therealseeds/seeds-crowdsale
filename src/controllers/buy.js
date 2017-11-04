import config from "config";
import { withdrawFromWallet } from "api/ethereum/wallets";
import { validateTransaction, transactionStatus } from "api/ethereum/transactions";
import { getUser, addPendingPurchase, updatePurchase } from "api/db";
import { sendPurchaseConfirmedEmail } from "api/utils/mailer";
import { sendTransactionStatusSlack } from "api/utils/slack";


export default async (req, res) => {

  if (!req.session.email) {
    return res.redirect("/?signin=true&errorMessage=badInput");
  }

  const user = await getUser(req.session.email);
  const { transactionHash, balance } = withdrawFromWallet(user.walletID, user.walletAddress);

  if (!transactionHash) {
    return res.redirect("/contribute?errorMessage=transactionFailed");
  }

  const price = getCurrentPriceInWei();
  addPendingPurchase(req.session.email, price, balance, transactionHash);

  validateTransaction(transactionHash).then((status) => {
    updatePurchase(transactionHash, status);
    sendTransactionStatusSlack(transactionHash, status);

    if (status == transactionStatus.CONFIRMED) {
      sendPurchaseConfirmedEmail(req.session.email);
    } else {
      // TODO: send purchase failed email
    }
  });

  req.session.purchase = balance;
  return res.redirect("/thanks");
}

const getCurrentPriceInWei = () => {
  // TODO: logic for promo codes
  // TODO: logic for increamental price
  return config.initialPriceInWei;
};
