const connection = require("../db/connection");

const { fetchTopics } = require("../models/topicsModel");
const { fetchUsers } = require("../models/usersModel");
exports.fetchArticles = (
  sort_by = "created_at",
  order = "desc",
  author,
  topic
) => {
  //console.log({ sort_by }, { order }, { author }, { topic });
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
        //console.log("returning articles");
        return [articles]; //passing article array onto next .then block//
      } else if (topic) {
        //console.log("returning topic promise");
        let topicPromise = fetchTopics();
        return Promise.all([articles, topicPromise]);
      } else if (author) {
        //console.log("returning user promise");
        let usersPromise = fetchUsers(author);
        return Promise.all([articles, usersPromise]);
      }
    })
    .then(response => {
      [articles, promiseArray] = response;
      // console.log({ articles }, { sort_by }, { order }, { author }, { topic });
      // console.log(articles, promiseArray);
      if (articles.length > 0) {
        return articles; //returning article array to controller
      }

      if (author) {
        return [];
      }

      if (topic) {
        let count = 0;
        promiseArray.forEach(topicObj => {
          //console.log(topicObj.slug === topic);
          if (topicObj.slug === topic) {
            // console.log(
            //   "retuning empty array - topic existed but no articles found"
            // );
            count++;
          }
        });
        if (count > 0) {
          return [];
        }
        // console.log("erroring out - topic did not exist");
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

exports.updateArticleVotes = (article_id, updateBy = 0) => {
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
  //console.log(article_id, sort_by);
  return connection("comments")
    .where("article_id", article_id)
    .select("comment_id", "votes", "created_at", "author", "body")
    .orderBy(sort_by || "created_at", order || "desc")
    .then(commentArray => {
      if (commentArray.length > 0) {
        return [commentArray];
      }
      //check if article_id exists

      let articlesPromise = exports.fetchArticles();
      return Promise.all([commentArray, articlesPromise]);
    })
    .then(response => {
      [comments, articlesArray] = response;
      //console.log(comments);
      if (comments.length > 0) {
        return comments;
      }
      //console.log({ comments }, { articlesArray }, typeof article_id);
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
