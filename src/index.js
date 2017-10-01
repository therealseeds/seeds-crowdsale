import express from "express";
import mustacheExpress from "mustache-express";
import winston from "winston";
import config from "config";
import { crowdsale } from "api/controllers/crowdsale";

export const app = express();

app.engine("mustache", mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/views/public'));

app.listen(config.port, () => winston.info(`Listening port ${config.port}`));

app.get("/", crowdsale);
