import createQRcode from "api/utils/qrcode";
import createWallet from "api/utils/wallets";
import { getUser } from "api/db";


export default async (req, res) => {

  if (!req.session.email) {
    res.status(400);
    return res.send({ status: "Bad Request" });
  }

  const user = await getUser(req.session.email);

  const walletID = user.walletID;
  let address;
  if (!user.walletAddress) {
    address = createWallet(walletID);
    // add to db
  }

  await createQRcode(address, walletID);

  res.status(200);
  return res.send({ address, walletID });
};
