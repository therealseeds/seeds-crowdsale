import config from "config";

export default (req, res) => {
  res.render('faq', {
    tokenAddress: config.seeds_token_address,
    price: config.initialPriceInWei * config.sds / config.ether,
    onDiscount: false,
    discount: 0
  });
}
