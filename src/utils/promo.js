const promoCodes = {
  "SEEDSTOKENS": {
    expires: 1510387200000,
    discount: 0.2
  },
  "SEEDS2017": {
    expires: 1510387200000,
    discount: 0.2
  },
  "TOKENSALE2017": {
    expires: 1510387200000,
    discount: 0.2
  },
  "SEEDSGIVES": {
    expires: 1510387200000,
    discount: 0.2
  }
};

export const isValidCode = (code) => (code != undefined && promoCodes[code] != undefined && Date.now() <= promoCodes[code].expires);

export const getDiscount = (code) => isValidCode(code) ? promoCodes[code].discount : 0;
