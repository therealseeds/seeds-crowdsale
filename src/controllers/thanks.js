import { addPurchaseConfirmationEmail } from "api/db";


export default async (req, res) => {

  const email = req.query.user;

  if (email) {
    addPurchaseConfirmationEmail(email);
  }

  res.render('thanks');
}
