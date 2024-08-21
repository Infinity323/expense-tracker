const validationErrorHandler = (err, req, res, next) => {
  if (err.status == 400 && !err.response) {
    console.error(
      `${req.method} request for ${req.url} failed validation: ${err.message}`
    );
    res.status(400).json({ error: err.message });
  } else {
    next(err);
  }
};

const clientErrorHandler = (err, req, res, next) => {
  if (err.response) {
    console.error(
      `Error during internal client API call while handling ${
        req.method
      } request for ${req.url}: ${JSON.stringify(err.response.data)}`
    );
    res
      .status(err.response.status)
      .json({ error: err.response.data.error_message });
  } else {
    next(err);
  }
};

const defaultErrorHandler = (err, req, res, next) => {
  console.error(
    `Error while handling ${req.method} request for ${req.url}`,
    err.stack
  );
  res.status(500).json({ error: "Internal Server Error" });
};

module.exports = {
  validationErrorHandler,
  clientErrorHandler,
  defaultErrorHandler,
};
