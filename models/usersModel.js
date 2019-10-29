const connection = require("../db/connection");

exports.fetchUsers = username => {
  return connection
    .select("*")
    .from("users")
    .where("username", username);
};
