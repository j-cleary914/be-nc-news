exports.handlePSQLErrors = (err, req, res, next) => {
  //console.log(err);
  let errorObject = {
    "22P02": { status: 400, msg: "invalid input syntax, not an integer" },
    "42703": { status: 400, msg: "column does not exist" },
    "23502": { status: 400, msg: "required value can not be null" },
    "23503": { status: 400, msg: "foreign key violated" }
  };
  if (err.code === "22P02") {
    next(errorObject["22P02"]);
  }
  if (err.code === "42703") {
    next(errorObject["42703"]);
  }
  if (err.code === "23502") {
    next(errorObject["23502"]);
  }
  if (err.code === "23503") {
    next(errorObject["23503"]);
  }

  next(err);
};

exports.handleCustomErrors = (err, req, res, next) => {
  //console.log(err);
  res.status(err.status).send({ msg: err.msg });
};
