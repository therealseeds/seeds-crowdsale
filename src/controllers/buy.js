import config from "config";
import { withdrawFromWallet } from "api/ethereum/wallets";
import { validateTransaction, transactionStatus } from "api/ethereum/transactions";
import { getUser, addPendingPurchase, updatePurchase } from "api/db";
import { sendPurchaseConfirmedEmail, sendPurchaseFailedEmail } from "api/utils/mailer";
import { sendTransactionStatusSlack, sendTransactionErrorSlack } from "api/utils/slack";
import { getDiscount, isValidCode } from "api/utils/promo";


export default async (req, res) => {

  if (!req.session.email) {
    return res.redirect("/?signin=true&errorMessage=badInput");
  }

  if (req.body.promo && !isValidCode(req.body.promo)) {
    return res.redirect("/contribute?errorMessage=invalidPromo");
  }

  const user = await getUser(req.session.email);
  const { transactionHash, balance, error } = withdrawFromWallet(user.walletID, user.walletAddress);

  if (error) {
    sendTransactionErrorSlack(error, "ETH", req.session.email);
  }

  if (!transactionHash) {
    return (balance == 0)
      ? res.redirect("/contribute?errorMessage=zeroBalance")
      : res.redirect("/contribute?errorMessage=transactionFailed");
  }

  const price = getCurrentPriceInWei(req.body.promo);
  addPendingPurchase(req.session.email, price, balance, transactionHash, req.body.promo);

  validateTransaction(transactionHash).then((status) => {
    updatePurchase(transactionHash, status);
    sendTransactionStatusSlack(transactionHash, status, "ETH");

    if (status == transactionStatus.CONFIRMED) {
      sendPurchaseConfirmedEmail(req.session.email);
    } else {
      sendPurchaseFailedEmail(req.session.email);
    }
  });

  req.session.purchase = balance;
  req.session.promoDiscount = getDiscount(req.body.promo);
  return res.redirect("/thanks");
}

const getCurrentPriceInWei = (promoCode) => {
  // TODO: logic for increamental price
  const promoDiscount = getDiscount(promoCode);
  return config.initialPriceInWei * (1 - promoDiscount);
};
