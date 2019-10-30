exports.send405Error = (req, res, next) => {
  res.status(405).send({ msg: "you cant use that method!" });
};

exports.sendError = (err, req, res, next) => {
  res.status(404).send({ msg: err.msg });
};
