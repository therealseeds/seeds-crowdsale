import config from "config";

const promoTypes = {
  PRICE_DISCOUNT: "discount", // User gets a price discount
  MORE_TOKENS: "more" // User gets more tokens
};

const promoCodes = {
  "SEEDSTOKENS": {
    type: promoTypes.PRICE_DISCOUNT,
    expires: 1514275200000,
    discount: 0.6,
    threshold: 0
  },
  "SEEDS2017": {
    type: promoTypes.PRICE_DISCOUNT,
    expires: 1510387200000,
    discount: 0.2,
    threshold: 0
  },
  "TOKENSALE2017": {
    type: promoTypes.PRICE_DISCOUNT,
    expires: 1510387200000,
    discount: 0.2,
    threshold: 0
  },
  "SEEDSGIVES": {
    type: promoTypes.PRICE_DISCOUNT,
    expires: 1510387200000,
    discount: 0.2,
    threshold: 0
  },
  "BERKELEY": {
    type: promoTypes.PRICE_DISCOUNT,
    expires: 1514275200000, // 12/25
    discount: 0.2,
    threshold: 0
  },
  "BACKSTAGE": {
    type: promoTypes.PRICE_DISCOUNT,
    expires: 1514275200000, // 12/25
    discount: 0.2,
    threshold: 0
  },
  "GIVETHANKS": {
    type: promoTypes.PRICE_DISCOUNT,
    expires: 1514275200000, // 12/25
    discount: 0.7,
    threshold: 7 // Threshold in ETH above which the promo code is valid
  },
  "SEEDSTHANKSYOU": {
    type: promoTypes.MORE_TOKENS,
    expires: 1514275200000, // 12/25
    discount: 0.6,
    threshold: 1 // Threshold in ETH above which the promo code is valid
  }
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
