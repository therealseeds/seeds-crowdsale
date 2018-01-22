import config from "config";

const promoTypes = {
  PRICE_DISCOUNT: "discount", // User gets a price discount
  MORE_TOKENS: "more" // User gets more tokens
};

const promoCodes = {
  "WELOVEOURCOMMUNITY": {
    type: promoTypes.PRICE_DISCOUNT,
    expires: 1516953600000, // 1/25
    discount: 0.25,
    threshold: 0
  },
  "PROSPERITY": {
    type: promoTypes.PRICE_DISCOUNT,
    expires: 1522555199000, // 3/31
    discount: 0.3,
    threshold: 0
  },
  "COLORINGCRYPTO": {
    type: promoTypes.PRICE_DISCOUNT,
    expires: 1522555199000, // 3/31
    discount: 0.3,
    threshold: 0.1
  },
  "SEEDSGIVES": {
    type: promoTypes.PRICE_DISCOUNT,
    expires: 1514275200000,
    discount: 0.4,
    threshold: 0
  },
  "FREEDOM": {
    type: promoTypes.PRICE_DISCOUNT,
    expires: 1516359600000, // 1/19
    discount: 0.5,
    threshold: 0.25
  },
  "ANDREWISAWESOME": {
    type: promoTypes.PRICE_DISCOUNT,
    expires: 1517461199000, // 1/31
    discount: 0.4,
    threshold: 0
  },
    "MAKINGMONEYHELPS": {
    type: promoTypes.MORE_TOKENS,
    expires: 1515905999000, // 1/31
    discount: 0.5,
    threshold: 1 // Threshold in ETH above which the promo code is valid
  },
  "GETWHATYOUNEED": {
    type: promoTypes.MORE_TOKENS,
    expires: 1516597200000, // 1/22
    discount: 0.05,
    threshold: 0.25 // Threshold in ETH above which the promo code is valid
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
