import winston from "winston";
import config from "config";
import { MongoClient } from 'mongodb';

const buildMongoUrl = ({ host, port, user, password, database, replica }) => {
  const options = (replica && replica != "null") ? `?replicaSet=${replica}` : '';
  return `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${encodeURIComponent(database)}${options}`;
};

const mongoUrl = buildMongoUrl(config.mongo);
winston.info(`Trying to connect to ${config.mongo.database}`);
const mongoDbPromise = new MongoClient.connect(mongoUrl)
  .catch((err) => winston.error(`Could not connect to mongodb ${config.mongo.database}:` + err));

export const addUserEmail = async (email) => {
  const mongo = await mongoDbPromise;
  mongo.collection(`crowdsale_users`).update({ "email": email }, { "email": email }, { upsert: true }).catch((err) => winston.error(`Error occured from mongodb ` + err));
};

export const addPurchaseConfirmationEmail = async (email) => {
  const mongo = await mongoDbPromise;
  mongo.collection(`crowdsale_confirmed_purchase`).update({ "email": email }, { "email": email }, { upsert: true }).catch((err) => winston.error(`Error occured from mongodb ` + err));
};
