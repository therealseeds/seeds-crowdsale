import config from "config";


export const thanks = async (req, res) => {
  // Approximate purchase in USD
  const purchase = req.session.purchase ? req.session.purchase / config.ether * 300 : 0;
  req.session.purchase = null;

  const promoDiscount = req.session.promoDiscount * 100;
  const showPromo = promoDiscount > 0;
  req.session.promoDiscount = null;

  res.render('thanks', { purchase, promoDiscount, showPromo });
}

export const thanksAgain = async (req, res) => {
  res.render('thanksAgain');
}
