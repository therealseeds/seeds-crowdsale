import { getCrowdsaleProgressInfo, getCrowdsalePriceInfo } from "api/contracts/crowdsale";

export default async (req, res) => {

  const crowdsaleProgressInfo = await getCrowdsaleProgressInfo();
  const crowdsalePriceInfo = await getCrowdsalePriceInfo();

  const data = {
    price: crowdsalePriceInfo.price,
    totalRaised: crowdsaleProgressInfo.totalRaised,
    deadline: crowdsaleProgressInfo.deadline,
    // percentageCompleted: crowdsaleProgressInfo.percentageCompleted
    percentageCompleted: 80 // TODO: remove. Just for testing
  };

  res.render('index', data);
};
