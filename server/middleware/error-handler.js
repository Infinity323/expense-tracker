const clientErrorHandler = (err, req, res, next) => {
  if (err.response) {
    console.error(
      "Error during internal client API call while handling %s request to %s: %s",
      req.method,
      req.url,
      JSON.stringify(err.response.data)
    );
    res
      .status(err.response.status)
      .send({ error: err.response.data.error_message });
  } else {
    next(err);
  }
};

const defaultErrorHandler = (err, req, res, next) => {
  console.error(
    "Error while handling %s request to %s",
    req.method,
    req.url,
    err.stack
  );
  res.status(500).send({ error: "Internal Server Error" });
};

module.exports = {
  clientErrorHandler,
  defaultErrorHandler: defaultErrorHandler,
};
