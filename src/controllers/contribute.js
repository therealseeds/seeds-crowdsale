import config from "config";
import { addUserEmail } from "api/db";
import { addToMailingList } from "api/utils/mailchimp";

export default async (req, res) => {

  const email = req.body.email;

  if (isValideEmail(email)) {
    addToMailingList(email);
  }

  if (!req.session.email) {
    if (!(email && isValideEmail(email))) {
      return res.redirect('/email');
    }

    req.session.email = email;
    if (email != "securitycheck@mail.com") {
      addUserEmail(email);
    }
  }

  if (config.current_phase == "presale") {

    const data = {
      price: config.initialPriceInWei * config.sds / config.ether,
      onDiscount: false,
      discount: config.presaleDiscount
    };

    res.render('contribute_closed', data);
  }
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
