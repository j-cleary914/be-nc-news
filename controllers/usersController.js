const { fetchUsers } = require("../models/usersModel");

exports.getUsers = (req, res, next) => {
  fetchUsers(req.params.username)
    .then(user => {
      res.status(200).send({ user: user[0] });
    })
    .catch(next);
};
