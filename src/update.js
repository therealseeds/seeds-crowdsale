import config from "config";
import { MongoClient } from 'mongodb';

const buildMongoUrl = ({ host, port, user, password, database, replica }) => {
  const options = (replica && replica != "null") ? `?replicaSet=${replica}` : '';
  return `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${encodeURIComponent(database)}${options}`;
};

const mongoUrl = buildMongoUrl(config.mongo);
const mongoDbPromise = new MongoClient.connect(mongoUrl);

const update = async (email) => {
  const mongo = await mongoDbPromise;
  const users = await mongo.collection(`crowdsale_users`).find({}).toArray();

  let emailSet = new Set();
  for (let user of users) {
    emailSet.add(user['email']);
  }

  await mongo.collection(`crowdsale_users`).remove({});

  for (let email of emailSet) {
    if (email != "securitycheck@mail.com") {
      mongo.collection(`crowdsale_users`).insertOne({ "email": email });
    }
  }
}

update();
