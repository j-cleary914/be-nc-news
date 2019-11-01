const connection = require("../db/connection");

const { fetchTopics } = require("../models/topicsModel");
const { fetchUsers } = require("../models/usersModel");
exports.fetchArticles = (
  sort_by = "created_at",
  order = "desc",
  author,
  topic
) => {
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
      if (articles.length > 0) {
        return [articles];
      } else if (topic) {
        let topicPromise = fetchTopics();
        return Promise.all([articles, topicPromise]);
      } else if (author) {
        let usersPromise = fetchUsers(author);
        return Promise.all([articles, usersPromise]);
      }
    })
    .then(response => {
      [articles, promiseArray] = response;

      if (articles.length > 0) {
        return articles;
      }

      if (author) {
        return [];
      }

      if (topic) {
        let count = 0;
        promiseArray.forEach(topicObj => {
          if (topicObj.slug === topic) {
            count++;
          }
        });
        if (count > 0) {
          return [];
        }
        return Promise.reject({
          status: 404,
          msg: "attempted to sort by topic that doesn't exist"
        });
      }
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
      if (x.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "no article with that article_id"
        });
      }
      return x;
    });
};

exports.updateArticleVotes = (article_id, updateBy = 0) => {
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
  return connection("comments")
    .where("article_id", article_id)
    .select("comment_id", "votes", "created_at", "author", "body")
    .orderBy(sort_by || "created_at", order || "desc")
    .then(commentArray => {
      if (commentArray.length > 0) {
        return [commentArray];
      }

      let articlesPromise = exports.fetchArticles();
      return Promise.all([commentArray, articlesPromise]);
    })
    .then(response => {
      [comments, articlesArray] = response;

      if (comments.length > 0) {
        return comments;
      }

      let number_article_id = Number(article_id);
      let count = 0;
      articlesArray.forEach(comment => {
        if (comment.article_id === number_article_id) {
          count++;
        }
      });
      if (count > 0) {
        return [];
      }
      return Promise.reject({
        status: 404,
        msg: "no article with that article_id"
      });
    });
};
