const express = require("express");
const app = express();
const apiRouter = require("./Routes/apiRouter");
const { sendError } = require("./errors/index");

app.use(express.json());

app.use("/api", apiRouter);

app.use(sendError);

module.exports = app;
