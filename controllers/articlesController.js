const {
  fetchArticle,
  fetchArticles,
  updateArticleVotes,
  addComment,
  fetchComments
} = require("../models/articlesModel");

exports.getArticles = (req, res, next) => {
  //console.log(req.query);
  let order = req.query.order;
  let sort_by = req.query.sort_by;
  let author = req.query.author;
  let topic = req.query.topic;

  //console.log({ sort_by }, { order }, { author }, { topic });
  fetchArticles(sort_by, order, author, topic)
    .then(articles => {
      //console.log(articles);
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticle = (req, res, next) => {
  let article_id = req.params.article_id;
  fetchArticle(article_id)
    .then(article => {
      //console.log(article);
      res.status(200).send({ article: article[0] });
    })
    .catch(next);
};

exports.patchArticleVotes = (req, res, next) => {
  let article_id = req.params.article_id;
  updateArticleVotes(article_id, req.body.inc_votes)
    .then(response => {
      res.status(200).send({ article: response });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  let article_id = req.params.article_id;
  let username = req.body.username;
  let comment = req.body.body;

  addComment(article_id, username, comment)
    .then(comment => {
      res.status(201).send({ comment: comment[0] });
    })
    .catch(next);
};

exports.getComments = (req, res, next) => {
  let article_id = req.params.article_id;
  //console.log(req.query);

  fetchComments(article_id, req.query.sort_by, req.query.order)
    .then(response => {
      res.status(200).send({ comments: response });
    })
    .catch(next);
};
