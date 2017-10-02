import express from "express";
import mustacheExpress from "mustache-express";
import winston from "winston";
import config from "config";
import index from "api/controllers/index";
import contribute from "api/controllers/contribute";
import bodyParser from "body-parser";

export const app = express();

app.engine("mustache", mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/views/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.listen(config.port, () => winston.info(`Listening port ${config.port}`));

app.get("/", index);
app.use("/contribute", contribute);
app.use((req, res) => {
  res.status(404);
  res.render('404');
});
