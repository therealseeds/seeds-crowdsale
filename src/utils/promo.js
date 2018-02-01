import config from "config";

const promoTypes = {
  PRICE_DISCOUNT: "discount", // User gets a price discount
  MORE_TOKENS: "more" // User gets more tokens
};

const promoCodes = {
  "FORBES": {
    type: promoTypes.PRICE_DISCOUNT,
    expires: 11522468799000, // 3/30
    discount: 0.25,
    threshold: 0.1
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
  "THANKSBRITTNEY": {
    type: promoTypes.PRICE_DISCOUNT,
    expires: 1517633999000, // 2/2
    discount: 0.65,
    threshold: 0.5
  },
    "WELCOME": {
    type: promoTypes.MORE_TOKENS,
    expires: 1525147199000, // 4/30
    discount: 0.4,
    threshold: 0.2 // Threshold in ETH above which the promo code is valid
  },
  "GETWHATYOUNEED": {
    type: promoTypes.MORE_TOKENS,
    expires: 1522555199000, // 3/31
    discount: 0.6,
    threshold: 0.5 // Threshold in ETH above which the promo code is valid
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
