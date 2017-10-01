import config from "config";
import { MongoClient } from 'mongodb';

const buildMongoUrl = ({ host, port, user, password, database, replica }) => {
  const options = replica ? `?replicaSet=${replica}` : '';
  return `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${encodeURIComponent(database)}${options}`;
};

const mongoDbPromise = new MongoClient.connect(buildMongoUrl(config.mongo))
  .catch((err) => winston.error(`Could not connect to mongodb ${config.mongo.database}:` + err));

export const addUserEmail = async (email) => {
  const mongo = await mongoDbPromise;
  mongo.collection(`crowdsale_users`).insertOne({ "email": email }).catch((err) => winston.error(`Error occured from mongodb ` + err));
};
