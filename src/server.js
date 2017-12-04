import express from "express";
import mustacheExpress from "mustache-express";
import session from 'cookie-session';
import healthcheck from "express-healthcheck";
import winston from "winston";
import bodyParser from "body-parser";
import config from "config";
import index from "api/controllers/index";
import { signUp, signIn, signOut, verifyEmail } from "api/controllers/authentication";
import contribute from "api/controllers/contribute";
import faq from "api/controllers/faq";
import { thanks, thanksAgain } from "api/controllers/thanks";
import getWallet from "api/controllers/wallet";
import getQRcode from "api/controllers/qrcode";
import buy from "api/controllers/buy";
import retrieve from "api/controllers/retrieve";
import getSeeds from "api/controllers/getseeds";
import { getAddNeed, postAddNeed } from "api/controllers/addNeed";
import { getTerms, postTerms } from "api/controllers/terms";
import { getRedeem, postRedeem } from "api/controllers/redeem";

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
  name: 'seeds-session',
  keys: ['mfxgayxHnY8kyBJh', 'HMX4tb2yfzAu2fzG']
}))

app.get("/", index);
app.post("/signup", signUp);
app.post("/signin", signIn);
app.get("/signout", signOut);
app.use("/contribute", contribute);
app.get("/thanks", thanks);
app.get("/thanks-again", thanksAgain);
app.use("/faq", faq);
app.get("/wallet", getWallet);
app.use("/buy", buy);
app.get("/retrieve", retrieve);
app.post("/getseeds", getSeeds);
app.get("/verify-email", verifyEmail);

app.get("/add-need", getAddNeed);
app.post("/add-need", postAddNeed);
app.get("/terms", getTerms)
app.post("/terms", postTerms);

app.get("/redeem/:needUUID", getRedeem);
app.post("/redeem/:needUUID", postRedeem);

app.get('/qr/:address', getQRcode);
app.get("/ping", healthcheck());
app.use("not-found", (req, res) => {
  res.status(404);
  res.render('404');
});
app.use((req, res) => {
  res.status(404);
  res.render('404');
});
