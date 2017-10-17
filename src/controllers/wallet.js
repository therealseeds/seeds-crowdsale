import { getWalletAddress, getWalletBalance } from "api/ethereum/wallets";
import { getUser, addWalletAddress } from "api/db";

export default async (req, res) => {

  if (!req.session.email) {
    res.status(400);
    return res.send({ status: "Bad Request" });
  }

  const user = await getUser(req.session.email);

  const walletID = user.walletID;
  const address = user.walletAddress || getWalletAddress(walletID);
  if (!user.walletAddress) {
    addWalletAddress(req.session.email, address);
  }

  const balance = getWalletBalance(address);

  res.status(200);
  return res.send({ address, balance });
};
