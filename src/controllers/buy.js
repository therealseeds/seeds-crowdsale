import config from "config";
import { withdrawFromWallet } from "api/ethereum/wallets";
import { getUser } from "api/db";

export default async (req, res) => {

  if (!req.session.email) {
    return res.redirect("/?signin=true&errorMessage=badInput");
  }

  const user = await getUser(req.session.email);
  const success = withdrawFromWallet(user.walletID, user.walletAddress);

  console.log(success);



}
