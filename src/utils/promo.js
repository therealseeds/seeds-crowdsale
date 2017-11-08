const promoCodes = {
  "CODE1": {
    expires: 1510387200000,
    discount: 0.2
  },
  "CODE2": {
    expires: 1510387200000,
    discount: 0.2
  },
  "CODE3": {
    expires: 1510387200000,
    discount: 0.2
  },
  "CODE4": {
    expires: 1510387200000,
    discount: 0.2
  }
};

export const isValidCode = (code) => (code != undefined && promoCodes[code] != undefined && Date.now() <= promoCodes[code].expires);

export const getDiscount = (code) => isValidCode(code) ? promoCodes[code].discount : 0;
