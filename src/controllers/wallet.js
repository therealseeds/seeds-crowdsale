import { getWalletAddress, getWalletBalance } from "api/ethereum/wallets";
import { getUser, addWalletAddress } from "api/db";

export default async (req, res) => {

  res.setHeader('Content-Type', 'application/json');

  if (!req.session.email) {
    res.status(403);
    return res.send(JSON.stringify({ status: "Permission Denied" }));
  }

  const user = await getUser(req.session.email);

  if (!user.termsAccepted) {
    res.status(403);
    return res.send(JSON.stringify({ status: "Permission Denied" }));
  }

  const walletID = user.walletID;
  const address = getWalletAddress(walletID);
  addWalletAddress(req.session.email, address);

  const balance = getWalletBalance(address);

  req.session.address = true;
  res.status(200);
  return res.send(JSON.stringify({ address, balance }));
};
