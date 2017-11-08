import { getWalletAddress, getWalletBalance } from "api/ethereum/wallets";
import { getUser, addWalletAddress } from "api/db";

export default async (req, res) => {

  res.setHeader('Content-Type', 'application/json');

  if (!req.session.email) {
    res.status(400);
    return res.send(JSON.stringify({ status: "Bad Request" }));
  }

  const user = await getUser(req.session.email);

  const walletID = user.walletID;
  const address = user.walletAddress || getWalletAddress(walletID);
  if (!user.walletAddress) {
    addWalletAddress(req.session.email, address);
  }

  const balance = getWalletBalance(address);

  req.session.address = true;
  res.status(200);
  return res.send(JSON.stringify({ address, balance }));
};
