const topicsRouter = require("express").Router();

const { getTopics } = require("../controllers/topicsController.js");
const { send405Error } = require("../errors/errorHandler");


topicsRouter
  .route("/")
  .get(getTopics)
  .all(send405Error);

module.exports = topicsRouter;
