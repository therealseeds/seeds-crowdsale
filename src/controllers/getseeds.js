import config from "config";
import { getUser, updatePurchase, updateTokensRetrieved } from "api/db";
import { isValidAddress } from "api/ethereum/wallets";
import { getConfirmedPurchases, calculateTotalSeedsUnits } from "api/utils/purchases";
import { sendTokensTo } from "api/ethereum/token";
import { validateTransaction, transactionStatus } from "api/ethereum/transactions";
import { sendTransactionStatusSlack, sendTransactionErrorSlack } from "api/utils/slack";
import { sendRetrieveConfirmedEmail, sendRetrieveFailedEmail } from "api/utils/mailer";


export default async (req, res) => {

  if (!req.session.email) {
    return res.redirect("/?signin=true&errorMessage=badInput");
  }

  if (!isValidAddress(req.body.address)) {
    return res.redirect("/retrieve?errorMessage=invalidAddress");
  }

  const user = await getUser(req.session.email);

  const confirmedPurchases = getConfirmedPurchases(user);
  const totalSeedsUnits = calculateTotalSeedsUnits(confirmedPurchases);

  if (totalSeedsUnits == 0) {
    return res.redirect("/retrieve?errorMessage=badInput");
  }

  const { transactionHash, error } = sendTokensTo(req.body.address, totalSeedsUnits);

  if (error) {
    sendTransactionErrorSlack(error, "Token", req.session.email);
  }

  if (!transactionHash) {
    return res.redirect("/retrieve?errorMessage=transactionFailed");
  }

  validateTransaction(transactionHash).then((status) => {

    sendTransactionStatusSlack(transactionHash, status, "Token");

    if (status == transactionStatus.CONFIRMED) {
      for (let purchase of confirmedPurchases) {
        updatePurchase(purchase.transaction, transactionStatus.COMPLETED);
      }

      updateTokensRetrieved(req.session.email, totalSeedsUnits, req.body.address);

      sendRetrieveConfirmedEmail(req.session.email);
    } else {
      sendRetrieveFailedEmail(req.session.email);
    }

  });

  return res.redirect("/thanks-again");
}
