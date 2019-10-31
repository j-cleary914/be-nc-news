const connection = require("../db/connection");

const { fetchTopics } = require("../models/topicsModel");
exports.fetchArticles = (
  sort_by = "created_at",
  order = "desc",
  author,
  topic
) => {
  //console.log(sort_by, order, author, topic);
  return connection
    .select("articles.*")
    .from("articles")
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .orderBy(sort_by, order)
    .modify(query => {
      if (author) {
        query.where({ "articles.author": author });
      }
      if (topic) {
        query.where({ "articles.topic": topic });
      }
    })
    .then(articles => {
      //console.log(articles);

      if (articles.length > 0) {
        return [articles];
      } else {
        let topicPromise = fetchTopics();
        return Promise.all([articles, topicPromise]);
      }
    })
    .then(response => {
      [articles, topicArray] = response;
      //console.log(articles, topic, topicArray);
      if (articles.length > 0) {
        return articles;
      }
      if (topic) {
        topicArray.forEach(topic => {
          // console.log(topic.slug === topic);
          if (topic.slug === topic) {
            return articles;
          }
        });
      }
      return Promise.reject({
        status: 400,
        msg: "attempted to sort by topic that doesn't exist"
      });
    });
};

exports.fetchArticle = article_id => {
  return connection
    .select("articles.*")
    .from("articles")
    .where("articles.article_id", article_id)
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")

    .then(x => {
      //console.log(x);
      if (x.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "no article with that article_id"
        });
      }
      return x;
    });
};

exports.updateArticleVotes = (article_id, updateBy) => {
  // console.log("inside model", article_id, updateBy);
  return connection
    .where({ article_id: article_id })
    .increment({ votes: updateBy }, ["article_id", "votes"])
    .into("articles")
    .returning("*")
    .then(response => {
      return response[0];
    });
};

exports.addComment = (article_id, username, comment) => {
  let formattedComment = {
    article_id: article_id,
    author: username,
    body: comment
  };

  return connection("comments")
    .insert(formattedComment)
    .returning("*");
};

exports.fetchComments = (article_id, sort_by, order) => {
  // console.log(article_id, sort_by);
  return connection("comments")
    .where("article_id", article_id)
    .select("comment_id", "votes", "created_at", "author", "body")
    .orderBy(sort_by || "created_at", order || "desc");
};
