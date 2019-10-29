const { fetchTopics } = require("../models/topicsModel");

exports.getTopics = (req, res, next) => {
  console.log("inside topics controller");
  fetchTopics().then(topics => {
    res.status(200).send(topics);
  });
};
