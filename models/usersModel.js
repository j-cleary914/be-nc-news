const connection = require("../db/connection");

exports.fetchUsers = username => {
  return connection
    .select("*")
    .from("users")
    .where("username", username)
    .then(x => {
      if (x.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "no user with that username"
        });
      }
      return x;
    });
};
