import config from "config";
import { getCrowdsaleProgressInfo, getCrowdsalePriceInfo } from "api/contracts/crowdsale";
import { getTokenInfo } from "api/contracts/token";

export default async (req, res) => {

  const tokenInfo = await getTokenInfo();
  // Balance of seeds at moment of presale should be equal to the amount total minus the token sold
  const presaleSdsSold = Math.round((tokenInfo.totalSupply - tokenInfo.balanceOfSeeds) / config.sds);

  if (config.current_phase == "presale") {

    const data = {
      phase: "Presale",
      showProgress: false,
      price: config.initialPriceInWei / config.ether * config.sds,
      // totalRaised: undefined,
      deadline: config.presaleDeadline,
      percentageCompleted: 0,
      sdsSold: presaleSdsSold
    };
    res.render('index', data);

  } else if (config.current_phase == "crowdsale") {

    const crowdsaleProgressInfo = await getCrowdsaleProgressInfo();
    const crowdsalePriceInfo = await getCrowdsalePriceInfo();

    // Balance of seeds at moment of crowdsale should be equal to the amount NOT for sale
    const sdsSold = Math.round((tokenInfo.totalSupply - tokenInfo.balanceOfSeeds - crowdsaleProgressInfo.availableSdsUnits) / config.sds);
    const percentageCompleted = 100 - (crowdsaleProgressInfo.availableSdsUnits * 100 / (tokenInfo.totalSupply - tokenInfo.balanceOfSeeds));

    const data = {
      phase: "Crowdsale",
      showProgress: percentageCompleted > 30,
      price: crowdsalePriceInfo.price,
      // totalRaised: crowdsaleProgressInfo.totalRaised,
      deadline: crowdsaleProgressInfo.deadline,
      percentageCompleted,
      sdsSold
    };
    res.render('index', data);
  }
};
