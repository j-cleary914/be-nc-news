exports.formatDates = list => {
  let formattedList = list.map(function(unformattedObject) {
    const { created_at, ...rest } = unformattedObject;
    let date = new Date(created_at);

    let formattedObject = { created_at: date, ...rest };
    return formattedObject;
  });
  return formattedList;
};

exports.makeRefObj = (list, key1, key2) => {
  let referenceObj = {};

  list.forEach(function(originalObject) {
    referenceObj[originalObject[key1]] = originalObject[key2];
  });

  return referenceObj;
};

exports.formatComments = (comments, articleRef) => {
  let formattedComments = comments.map(comment => {
    let formattedComment = {
      body: comment.body,
      article_id: articleRef[comment.belongs_to],
      votes: comment.votes,
      author: comment.created_by,
      created_at: comment.created_at
    };
    return formattedComment;
  });
  return formattedComments;
};
