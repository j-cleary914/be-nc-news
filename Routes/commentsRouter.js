const commentsRouter = require("express").Router();

const { send405Error } = require("../errors/errorHandler");

const {
  patchCommentVotes,
  deleteComment
} = require("../controllers/commentsController.js");



commentsRouter
  .route("/:comment_id")
  .patch(patchCommentVotes)
  .delete(deleteComment)
  .all(send405Error);

module.exports = commentsRouter;
