const express = require("express");
const app = express();
const apiRouter = require("./Routes/apiRouter");
const { handleCustomErrors, handlePSQLErrors } = require("./errors/index");

app.use(express.json());

app.use("/api", apiRouter);

app.use(handlePSQLErrors);

app.use(handleCustomErrors);

module.exports = app;
