import config from "config";
import { addToMailingList } from "api/utils/mailchimp";
import { getUser } from "api/db";

export default async (req, res) => {

  if (!req.session.email) {
    return res.redirect("/?signin=true&errorMessage=badInput");
  }

  const user = await getUser(req.session.email);

  const errorMessage = req.query.errorMessage;

  const data = {
    price: config.initialPriceInWei * config.sds / config.ether,
    onDiscount: false,
    discount: 0,
    showAddress: req.session.address == true,
    termsAccepted: user.termsAccepted || false,
    transactionFailed: errorMessage == "transactionFailed",
    zeroBalance: errorMessage == "zeroBalance",
    invalidPromo: errorMessage == "invalidPromo",
    insufficientDeposit: errorMessage == "insufficientDeposit",
  };

  res.render('contribute', data);

  // } else if (config.current_phase == "crowdsale") {
  //
  //   const crowdsalePriceInfo = await getCrowdsalePriceInfo();
  //   const data = {
  //     crowdsaleAddress: config.crowdsale_address,
  //     price: crowdsalePriceInfo.price,
  //     onDiscount: false,
  //     discount: undefined
  //   };
  //
  //   res.render('contribute', data);
  // }
};
