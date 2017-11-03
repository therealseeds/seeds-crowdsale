import config from "config";
import { getUser, updatePurchase, updateTokensRetrieved } from "api/db";
import { isValidAddress } from "api/ethereum/wallets";
import { getConfirmedPurchases, calculateTotalSeedsUnits } from "api/utils/purchases";
import { sendTokensTo } from "api/ethereum/token";
import { validateTransaction, transactionStatus } from "api/ethereum/transactions";


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

  const transactionHash = sendTokensTo(req.body.address, totalSeedsUnits);

  if (!transactionHash) {
    return res.redirect("/retrieve?errorMessage=transactionFailed");
  }

  validateTransaction(transactionHash).then((status) => {

    if (status == transactionStatus.CONFIRMED) {
      for (let purchase of confirmedPurchases) {
        updatePurchase(purchase.transaction, transactionStatus.COMPLETED);
      }

      updateTokensRetrieved(req.session.email, totalSeedsUnits, req.body.address);
    } else {
      // TODO: send slack if transaction failed
    }

  });

  return res.redirect("/thanks");
}
