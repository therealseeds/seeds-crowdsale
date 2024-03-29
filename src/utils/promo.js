import config from "config";

const promoTypes = {
  PRICE_DISCOUNT: "discount", // User gets a price discount
  MORE_TOKENS: "more" // User gets more tokens
};

const promoCodes = {
  "HELPOUTSEEDS": {
    type: promoTypes.PRICE_DISCOUNT,
    expires: 1534316399000, // 8/14
    discount: 0.3,
    threshold: 0
  },
  "WOOT": {
    type: promoTypes.PRICE_DISCOUNT,
    expires: 1533082520000, // 7/31
    discount: 0.2,
    threshold: 0.2
  },
  "HUZZAH": {
    type: promoTypes.PRICE_DISCOUNT,
    expires: 1533082520000, // 7/31
    discount: 0.3,
    threshold: 0.3
  },
  "YAY": {
    type: promoTypes.PRICE_DISCOUNT,
    expires: 1533082520000, // 7/31
    discount: 0.5,
    threshold: 0.5
  },
  "THANKS": {
    type: promoTypes.PRICE_DISCOUNT,
    expires: 1533082520000, // 7/31
    discount: 0.4,
    threshold: 0.4
  },
  "1000GIVERS": {
    type: promoTypes.MORE_TOKENS,
    expires: 1546318799000, // 12/31
    discount: 0.5,
    threshold: 0.2 // Threshold in ETH above which the promo code is valid
  },
   "INDEPENDENCE": {
    type: promoTypes.MORE_TOKENS,
    expires: 1531033199000, // 7/7
    discount: 0.3,
    threshold: 0.3 // Threshold in ETH above which the promo code is valid
  },
  "FUN": {
    type: promoTypes.MORE_TOKENS,
    expires: 1533082520000, // 7/31
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
