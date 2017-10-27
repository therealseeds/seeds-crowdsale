module.exports = {
  port: process.env.PORT || 3000,
  ethereum_node_url: "https://mainnet.infura.io",
  crowdsale_address: process.env.CROWDSALE_ADDRESS,
  seeds_token_address: process.env.TOKEN_ADDRESS,
  seeds_account_address: process.env.ACCOUNT_ADDRESS,
  seeds_wallet_address: process.env.WALLET_ADDRESS,
  ether: 1000000000000000000,
  sds: 10000000000,
  mongo: {
    host: process.env.MONGO_HOST,
    port: process.env.MONGO_PORT,
    user: process.env.MONGO_USER,
    password: process.env.MONGO_PASS,
    database: process.env.MONGO_DATABASE,
    replica: process.env.MONGO_REPLICA
  },
  current_phase: "presale",
  initialPriceInWei: 15000,
  presaleDeadline: 1509519600000,
  presaleDiscount: 15,
  mailchimp: {
   apiKey: "93fb8869c544c34b692e3f998f35f596-us16"
  }
}
