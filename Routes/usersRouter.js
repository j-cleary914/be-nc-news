const usersRouter = require("express").Router();

const { getUsers } = require("../controllers/usersController.js");

usersRouter.get("/:username", getUsers);

module.exports = usersRouter;
