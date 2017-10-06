import config from "config";
import { getCrowdsalePriceInfo } from "api/contracts/crowdsale";
import { addUserEmail } from "api/db";

const isValideEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export default async (req, res) => {

  const email = req.body.email;
  if (!(email && isValideEmail(email))) {
    return res.redirect('/');
  }

  addUserEmail(email);

  if (config.current_phase == "presale") {

    const data = {
      crowdsaleAddress: config.seeds_wallet_address,
      price: config.initialPriceInWei * config.sds / config.ether,
      onDiscount: true,
      discount: config.presaleDiscount
    };

    res.render('contribute', data);

  } else if (config.current_phase == "crowdsale") {

    const crowdsalePriceInfo = await getCrowdsalePriceInfo();
    const data = {
      crowdsaleAddress: config.crowdsale_address,
      price: crowdsalePriceInfo.price,
      onDiscount: false,
      discount: undefined
    };

    res.render('contribute', data);
  }
};
