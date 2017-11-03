import config from "config";


export default async (req, res) => {

  // Approximate purchase in USD
  const purchase = req.session.purchase ? req.session.purchase / config.ether * 300 : 0;
  req.session.purchase = null;
  res.render('thanks', { purchase });
}
