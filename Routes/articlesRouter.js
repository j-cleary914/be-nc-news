const articlesRouter = require("express").Router();

const {
  getArticle,
  getArticles,
  patchArticleVotes,
  postComment,
  getComments
} = require("../controllers/articlesController.js");
articlesRouter.route("/").get(getArticles);
articlesRouter.route("/:article_id").get(getArticle);
articlesRouter.route("/:article_id").patch(patchArticleVotes);
articlesRouter.route("/:article_id/comments").post(postComment);
articlesRouter.route("/:article_id/comments").get(getComments);

module.exports = articlesRouter;
