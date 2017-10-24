import config from "config";
import { addToMailingList } from "api/utils/mailchimp";

export default async (req, res) => {

  if (!req.session.email) {
    return res.redirect("/?signin=true&errorMessage=badInput");
  }

  if (config.current_phase == "presale") {

    const data = {
      price: config.initialPriceInWei * config.sds / config.ether,
      onDiscount: false,
      discount: config.presaleDiscount,
      showAddress: req.session.address == true
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
