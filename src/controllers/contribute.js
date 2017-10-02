import config from "config";
import { getCrowdsalePriceInfo } from "api/contracts/crowdsale";
import { addUserEmail } from "api/db";

const isValideEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export default async (req, res) => {

  if (req.body.email && isValideEmail(req.body.email)) {
    addUserEmail(req.body.email);
  }

  const crowdsalePriceInfo = await getCrowdsalePriceInfo();
  const data = {
    crowdsaleAddress: config.crowdsale_address,
    price: crowdsalePriceInfo.price
  };

  res.render('contribute', data);
};
