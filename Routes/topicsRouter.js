const topicsRouter = require("express").Router();

const { getTopics } = require("../controllers/topicsController.js");

topicsRouter.get("/", getTopics);

module.exports = topicsRouter;
