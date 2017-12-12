import sanitize from "mongo-sanitize";
import winston from "winston";
import uuidv4 from 'uuid/v4';
import config from "config";
import { MongoClient } from 'mongodb';
import autoIncrement from "mongodb-autoincrement";
import { transactionStatus } from "api/ethereum/transactions";

const buildMongoUrl = ({ host, port, user, password, database, replica }) => {
  const options = (replica && replica != "null") ? `?replicaSet=${replica}` : '';
  return `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${encodeURIComponent(database)}${options}`;
};

const mongoUrl = buildMongoUrl(config.mongo);
winston.info(`Trying to connect to ${config.mongo.database}`);
const mongoDbPromise = new MongoClient.connect(mongoUrl)
  .catch((err) => winston.error(`Could not connect to mongodb ${config.mongo.database}:` + err));

export const signUpUser = async (email, hashedPassword, salt, verifyToken) => {
  const mongo = await mongoDbPromise;
  const user = await mongo.collection(`tokensale_users`).findOne({ "email": email });
  if (user) { // User already exists
    return false;
  }

  autoIncrement.getNextSequence(mongo, `tokensale_users`, function (err, autoIndex) {
    mongo.collection(`tokensale_users`).insertOne({
      "walletID": autoIndex,
      "email": email,
      "password": hashedPassword,
      "salt": salt,
      "verifyToken": verifyToken,
      "emailVerified": false
    });
  });

  return true;
};

export const getUser = async (email) => {
  const mongo = await mongoDbPromise;
  return await mongo.collection(`tokensale_users`).findOne({ "email": email });
};

export const addWalletAddress = async (email, address) => {
  const mongo = await mongoDbPromise;
  mongo.collection(`tokensale_users`).updateOne(
    { "email": email },
    { "$set": { "walletAddress": address } },
  );
};

export const addAcceptedTerms = async (email) => {
  const mongo = await mongoDbPromise;
  mongo.collection(`tokensale_users`).updateOne(
    { "email": email },
    { "$set": { "termsAccepted": true } },
  );
};

export const addPendingPurchase = async (email, price, value, transactionHash, promoCode) => {
  const mongo = await mongoDbPromise;
  mongo.collection(`tokensale_users`).updateOne(
    { "email": email },
    { "$push": {
       "purchases": {
         "price" : price,
         "value" : value,
         "transaction": transactionHash,
         "createdAt" : Date.now(),
         "status": transactionStatus.PENDING,
         "promoCode": promoCode || null
       }
    }}
  );
};

export const updatePurchase = async (transactionHash, status) => {
  const mongo = await mongoDbPromise;
  mongo.collection(`tokensale_users`).updateOne(
    {
      "purchases.transaction": transactionHash
    },
    { "$set": {
       "purchases.$.status": status
    }}
  );
};

export const updateTokensRetrieved = async (email, seedsUnits, address) => {
  const mongo = await mongoDbPromise;
  mongo.collection(`tokensale_users`).updateOne(
    { "email": email },
    { "$push": {
       "tokensRetrieved": {
         "units" : seedsUnits,
         "address" : address,
         "retrievedAt" : Date.now()
       }
    }}
  );
};

export const verifyEmailToken = async (verifyToken) => {
  const mongo = await mongoDbPromise;
  const user = await mongo.collection(`tokensale_users`).findOneAndUpdate(
    {
      "verifyToken": verifyToken
    },
    { "$set": {
       "emailVerified": true
    }}
  );

  return user.value;
};

export const addUserInfo = async (email, name, gender, age, interests) => {
  const mongo = await mongoDbPromise;

  let set = {};
  if (name) set["fullname"] = sanitize(name);
  if (gender) set["gender"] = sanitize(gender);
  if (age) set["age"] = sanitize(age);
  if (interests) set["interests"] = sanitize(interests);

  mongo.collection(`tokensale_users`).updateOne(
    { "email": email },
    { "$set": set },
  );
};

export const addUserNeed = async (userID, title, description, cost, categories) => {
  const mongo = await mongoDbPromise;
  const need = await mongo.collection(`user_needs`).insertOne({
    "uuid": uuidv4(),
    "user_id": userID,
    "title": sanitize(title),
    "description": sanitize(description),
    "cost": sanitize(cost),
    "categories": sanitize(categories),
    "tokenRedeemed": false
  });
  return need.ops[0];
};

export const getNeedByUUID = async (needUUID, userID) => {
  const mongo = await mongoDbPromise;
  return await mongo.collection(`user_needs`).findOne({
    "uuid": needUUID,
    "user_id": userID
  });
};

export const redeemSeedsToken = async (needID, userID) => {
  const mongo = await mongoDbPromise;
  await mongo.collection(`user_needs`).updateOne(
    {
      "_id": needID,
      "user_id": userID
    },
    { "$set": {
       "tokenRedeemed": true
    }}
  );
};

export const deactivateNeed = async (needID, userID) => {
  const mongo = await mongoDbPromise;
  await mongo.collection(`user_needs`).updateOne(
    {
      "_id": needID,
      "user_id": userID
    },
    { "$set": {
       "tokenRedeemed": false
    }}
  );
};

export const addRedeemedTransaction = async (userID, transactionHash) => {
  const mongo = await mongoDbPromise;
  mongo.collection(`redeemed_transactions`).insertOne({
    "user_id": userID,
    "transaction": transactionHash
  });
};

export const isTransactionRedeemed = async (transactionHash) => {
  const mongo = await mongoDbPromise;
  const transaction = await mongo.collection(`redeemed_transactions`).findOne({
    "transaction": transactionHash
  });

  return (transaction) ? true : false;
};
