const {
  fetchArticle,
  fetchArticles,
  updateVotes,
  addComment,
  fetchComments
} = require("../models/articlesModel");

exports.getArticles = (req, res, next) => {
  fetchArticles().then(articles => {
    res.status(200).send(articles);
  });
};

exports.getArticle = (req, res, next) => {
  let article_id = req.params.article_id;
  fetchArticle(article_id)
    .then(article => {
      //console.log(article);
      res.status(200).send(article[0]);
    })
    .catch(next);
};

exports.patchArticleVotes = (req, res, next) => {
  let article_id = req.params.article_id;
  updateVotes(article_id, req.body.inc_votes)
    .then(response => {
      res.status(200).send({ article: response });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  let article_id = req.params.article_id;
  let username = req.body.username;
  let comment = req.body.body;

  addComment(article_id, username, comment).then(comment => {
    res.status(201).send({ comment: comment[0] });
  });
};

exports.getComments = (req, res, next) => {
  let article_id = req.params.article_id;
  //console.log(req.query);

  fetchComments(article_id, req.query.sort_by, req.query.order).then(
    response => {
      res.status(200).send({ comments: response });
    }
  );
};
