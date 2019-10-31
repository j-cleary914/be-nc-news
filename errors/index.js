exports.handlePSQLErrors = (err, req, res, next) => {
  //console.log(err);
  let errorObject = {
    "22P02": { status: 400, msg: "invalid input syntax, not an integer" },
    
  };
  if (err.code === "22P02") {
    next(errorObject["22P02"]);
  }

  next(err);
};

exports.handleCustomErrors = (err, req, res, next) => {
  //console.log(err);
  res.status(err.status).send({ msg: err.msg });
};
