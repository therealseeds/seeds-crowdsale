import config from "config";

const promoTypes = {
  PRICE_DISCOUNT: "discount", // User gets a price discount
  MORE_TOKENS: "more" // User gets more tokens
};

const promoCodes = {
  "FIRST10": {
    type: promoTypes.PRICE_DISCOUNT,
    expires: 1525665599000, // 5/6
    discount: 0.5,
    threshold: 0.5
  },
  "WOOT": {
    type: promoTypes.PRICE_DISCOUNT,
    expires: 1522555199000, // 3/31
    discount: 0.2,
    threshold: 0.2
  },
  "SEEDSGIVES": {
    type: promoTypes.PRICE_DISCOUNT,
    expires: 1525157999000, // 4/30
    discount: 0.3,
    threshold: 0.5
  },
  "GRACE": {
    type: promoTypes.PRICE_DISCOUNT,
    expires: 1522555199000, // 3/31
    discount: 0.5,
    threshold: 0.5
  },
  "THANKS": {
    type: promoTypes.PRICE_DISCOUNT,
    expires: 1522555199000, // 3/31
    discount: 0.4,
    threshold: 0.4
  },
  "1000GIVERS": {
    type: promoTypes.MORE_TOKENS,
    expires: 1530428399000, // 6/30
    discount: 0.5,
    threshold: 0.2 // Threshold in ETH above which the promo code is valid
  },
   "WELCOME": {
    type: promoTypes.MORE_TOKENS,
    expires: 1530428399000, // 6/30
    discount: 0.4,
    threshold: 0.4 // Threshold in ETH above which the promo code is valid
  },
  "FUN": {
    type: promoTypes.MORE_TOKENS,
    expires: 1522555199000, // 3/31
    discount: 0.1,
    threshold: 0.1 // Threshold in ETH above which the promo code is valid
  },
};

export const isValidCode = (code) => (code != undefined && promoCodes[code] != undefined && Date.now() <= promoCodes[code].expires);

export const getDiscount = (code, amount) => {
  // Check if deadline is not expired
  if (!isValidCode(code)) {
    return 0;
  }

  // Check if amount above threshold
  if (amount < promoCodes[code].threshold * config.ether) {
    return 0;
  }

  if (promoCodes[code].type == promoTypes.PRICE_DISCOUNT) {
    // Return simple discount
    return promoCodes[code].discount;

  } else if (promoCodes[code].type == promoTypes.MORE_TOKENS) {

    // Calculate total tokens to receive and final discount based on that
    const totalTokens = (amount * (1 + promoCodes[code].discount)) / config.initialPriceInWei;
    const finalPrice = amount / totalTokens;
    const finalDiscount = (config.initialPriceInWei - finalPrice) / config.initialPriceInWei;
    return Math.round(finalDiscount * 100) / 100;
  }
};
