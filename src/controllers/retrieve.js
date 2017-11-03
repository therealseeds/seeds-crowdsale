import config from "config";
import { getUser } from "api/db";
import { getConfirmedPurchases, calculateTotalSeeds } from "api/utils/purchases";

export default async (req, res) => {

  const errorMessage = req.query.errorMessage;

  let data = {
    isLoggedIn: req.session.email != undefined,
    wrongCredentialsError: errorMessage == "wrongCredentials",
    badInputError: errorMessage == "badInput",
    addressError: errorMessage == "invalidAddress",
    transactionFailed: errorMessage == "transactionFailed",
  };

  if (!req.session.email) {
    return res.render('retrieve', data);
  }

  const user = await getUser(req.session.email);

  const confirmedPurchases = getConfirmedPurchases(user);
  data.purchases = confirmedPurchases.map(purchaseFormatted);
  data.seeds = calculateTotalSeeds(confirmedPurchases).toFixed(2);

  res.render('retrieve', data);
}

const purchaseFormatted = (purchase) => {
  return {
    price: purchase.price * config.sds / config.ether,
    value: purchase.value / config.ether,
    createdAt: new Date(purchase.createdAt).toLocaleDateString("en-US")
  }
};
