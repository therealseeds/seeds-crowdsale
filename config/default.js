module.exports = {
  port: process.env.PORT || 3000,
  ethereum_node_url: "https://rinkeby.infura.io/iktD2PzcpqUckIsSa8U2",
  seeds_token_address: "0xcA1b9dF7b15639DA7106932C88de4b1Eab2CF1d1",
  seeds_token_owner_address: "0xA9846646E829362Da66Ac08570Fdf4741ad7779e",
  seeds_token_owner_private_key: "0304e23a2c9af588f39fedba9ddf00f92cc497edd65809595bd5d9e080eaa231",
  seeds_wallet_address: "0xA9846646E829362Da66Ac08570Fdf4741ad7779e",
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
  initialPriceInWei: 35000,
  presaleDeadline: 1510948799000,
  mailchimp: {
    apiKey: "93fb8869c544c34b692e3f998f35f596-us16",
    listID: "7226151fd8"
  },
  email: {
    sendEmails: true,
    sesAccessKeyId: "AKIAI3YCI5E43E2CE5QQ",
    sesSecretAccessKey: "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"
  },
  slack: {
    webhook: "https://hooks.slack.com/services/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",
    sendSlackMessage: false
  }
}
