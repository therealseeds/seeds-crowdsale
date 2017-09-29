import winston from "winston";
import config from "config";

export const authentication = (req, res, next) => {
  if (!req.query.key || req.query.key != config.auth_key) {
    return sendResponseData(res, 401);
  }
  next();
};

export const getRoot = (req, res) => res.send({
  status: "OK",
  endpoints: []
});

export const sendResponseData = (res, statusCode, responseData) => {
  res.status(statusCode);

  switch (statusCode) {
    case 200:
    case 201:
      return responseData ? res.send({ status: "OK", data: responseData }) : res.send({ status: "OK" });
    case 400:
      return res.send({ status: "Bad Request" });
    case 401:
      return res.send({ status: "Permission Denied" });
    case 404:
      return res.send({ status: "Not Found" });
    default:
      winston.error(`Logical error: status ${statusCode} not handled`);
      throw new Error("Logical error");
  }
};
