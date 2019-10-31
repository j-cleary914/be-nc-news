const articlesRouter = require("express").Router();

const { send405Error } = require("../errors/errorHandler");

const {
  getArticle,
  getArticles,
  patchArticleVotes,
  postComment,
  getComments
} = require("../controllers/articlesController.js");

articlesRouter
  .route("/")
  .get(getArticles)
  .all(send405Error);
articlesRouter
  .route("/:article_id")
  .get(getArticle)
  .patch(patchArticleVotes)
  .all(send405Error);

articlesRouter
  .route("/:article_id/comments")
  .post(postComment)
  .get(getComments)
  .all(send405Error);

module.exports = articlesRouter;
