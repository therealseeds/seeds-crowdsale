import winston from "winston";
import config from "config";
import { MongoClient } from 'mongodb';
import autoIncrement from "mongodb-autoincrement";

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

  mongo.collection(`crowdsale_users`).findOne({ "email": email }).then((user) => {
    if (!user) {
      autoIncrement.getNextSequence(mongo, `crowdsale_users`, function (err, autoIndex) {
          var collection = mongo.collection(`crowdsale_users`);
          collection.insertOne({
              "walletID": autoIndex,
              "email": email
          });
      });
    } else if (!user.walletID) {
      autoIncrement.getNextSequence(mongo, `crowdsale_users`, function (err, autoIndex) {
          var collection = mongo.collection(`crowdsale_users`);
          collection.updateOne(
            { "email": email },
            { "$set": { "walletID": autoIndex } },
          );
      });
    }
  });
};

export const getUser = async (email) => {
  const mongo = await mongoDbPromise;
  return await mongo.collection(`crowdsale_users`).findOne({ "email": email });
};
