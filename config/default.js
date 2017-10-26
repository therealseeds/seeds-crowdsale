module.exports = {
  port: process.env.PORT || 3000,
  ethereum_node_url: "https://rinkeby.infura.io/iktD2PzcpqUckIsSa8U2",
  seeds_token_address: "0xcA1b9dF7b15639DA7106932C88de4b1Eab2CF1d1",
  seeds_token_owner_address: "0x2BADe80D992dBB35a9532Ad5041A990Abea71B98",
  seeds_wallet_address: "0x769B46c558A8845d8Ac88C0924D72ea51E56ABCe",
  seeds_wallet_mnemonic: "parent wrestle vocal museums idea screen open between wrap guide input bridge",
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
  initialPriceInWei: 20000,
  presaleDeadline: 1510128000000,
  presaleDiscount: 0,
  mailchimp: {
   apiKey: "93fb8869c544c34b692e3f998f35f596-us16",
   listID: "7226151fd8"
 },

}
