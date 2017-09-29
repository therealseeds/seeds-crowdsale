import { getRoot, authentication } from "api/controllers";
import { crowdSale } from "api/controllers/crowdsale";

export default (app) => {
  // app.use(authentication);
  app.get("/", getRoot);
  app.get("/crowdsale", crowdSale);
};
