import express from "express";
import mustacheExpress from "mustache-express";
import session from 'cookie-session';
import healthcheck from "express-healthcheck";
import winston from "winston";
import config from "config";
import { index, indexAskEmail } from "api/controllers/index";
import contribute from "api/controllers/contribute";
import faq from "api/controllers/faq";
import thanks from "api/controllers/thanks";
import bodyParser from "body-parser";
import updateQRcode from "api/utils/qrcode";

export const app = express();

app.engine("mustache", mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/views/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(config.port, () => winston.info(`Listening port ${config.port}`));

app.use((req, res, next) => {
  var schema = req.headers["x-forwarded-proto"];
  if (schema == "http") {
    return res.redirect(`https://${req.get('host')}${req.originalUrl}`)
  }
  next();
});

app.use(session({
  name: 'session',
  keys: ['key1', 'key2']
}))

app.get("/", index);
app.use("/contribute", contribute);
app.get("/thanks", thanks);
app.get("/email", indexAskEmail);
app.use("/faq", faq);

app.get("/ping", healthcheck());
app.use((req, res) => {
  res.status(404);
  res.render('404');
});
