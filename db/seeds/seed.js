const {
  topicData,
  articleData,
  commentData,
  userData
} = require("../data/index.js");

const { formatDates, formatComments, makeRefObj } = require("../utils/utils");

exports.seed = function(knex) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      const topicsInsertions = knex("topics")
        .insert(topicData)
        .into("topics")
        .returning("*");

      const usersInsertions = knex("users")
        .insert(userData)
        .into("users")
        .returning("*");

      return Promise.all([topicsInsertions, usersInsertions])
        .then(() => {
          const formattedArticles = formatDates(articleData);

          return knex("articles")
            .insert(formattedArticles)
            .into("articles")
            .returning("*");
        })
        .then(articleRows => {
          const articleRef = makeRefObj(articleRows, "title", "article_id");
          const formattedComments_noTimestamp = formatComments(
            commentData,
            articleRef
          );
          const formattedComments = formatDates(formattedComments_noTimestamp);

          return knex("comments")
            .insert(formattedComments)
            .into("comments");
        });
    });
};
