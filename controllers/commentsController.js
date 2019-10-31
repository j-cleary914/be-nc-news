const {
  updateCommentVotes,
  destroyComment
} = require("../models/commentsModel");

exports.patchCommentVotes = (req, res, next) => {
  let comment_id = req.params.comment_id;
  updateCommentVotes(comment_id, req.body.inc_votes)
    .then(response => {
      res.status(200).send({ comment: response });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;

  destroyComment(comment_id)
    .then(response => {
      //console.log({ response });
      res.status(204).send({ response });
    })
    .catch(next);
};
