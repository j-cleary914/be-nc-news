const connection = require("../db/connection");

exports.updateCommentVotes = (comment_id, updateBy) => {
  //console.log("comments model", comment_id);
  return connection
    .where({ comment_id: comment_id })
    .increment({ votes: updateBy }, ["comment_id", "votes"])
    .into("comments")
    .returning("*")
    .then(response => {
      return response[0];
    });
};

exports.destroyComment = id => {
  return connection
    .del()
    .from("comments")
    .where("comment_id", id)
    .then(deletedCommentCount => {
      //console.log(deletedCommentCount);
      if (deletedCommentCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "no comment with that comment_id exists"
        });
      } else return deletedCommentCount;
    });
};
