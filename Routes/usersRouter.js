const usersRouter = require("express").Router();

const { getUsers } = require("../controllers/usersController.js");
const { send405Error } = require("../errors/errorHandler");

// usersRouter.get("/:username", getUsers).all(send405Error);
usersRouter
  .route("/:username")
  .get(getUsers)
  .all(send405Error);

module.exports = usersRouter;
