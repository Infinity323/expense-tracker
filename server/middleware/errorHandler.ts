import { logPlaidApiError } from "../utils/plaidLogging";

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
    const metadata = req.body?.metadata;
    const requestPath = (req.originalUrl ?? req.url).split("?")[0];
    const itemIdFromPath =
      requestPath.match(/\/transaction\/sync\/([^/]+)/)?.[1] ??
      requestPath.match(/\/item\/([^/]+)/)?.[1];
    const accountIds = Array.isArray(metadata?.accounts)
      ? metadata.accounts
          .map((account) => account?.id ?? account?.account_id)
          .filter((accountId): accountId is string => !!accountId)
      : undefined;
    logPlaidApiError(err, {
      operation: `${req.method} ${requestPath}`,
      item_id:
        req.params?.itemId ??
        req.params?.id ??
        req.body?.itemId ??
        itemIdFromPath,
      account_id: req.params?.accountId ?? req.body?.accountId ?? req.body?.account_id,
      account_ids: accountIds,
      link_session_id: metadata?.link_session_id ?? req.body?.link_session_id,
      institution_id: metadata?.institution?.institution_id,
    });
    res
      .status(err.response.status)
      .json({ error: err.response.data.error_message });
  } else {
    next(err);
  }
};

const defaultErrorHandler = (err, req, res, next) => {
  if (err?.name === "ConditionalCheckFailedException") {
    return res.status(404).json({ error: "Resource not found" });
  }
  console.error(
    `Error while handling ${req.method} request for ${req.url}`,
    err.stack
  );
  res.status(500).json({ error: "Internal Server Error" });
};

export { clientErrorHandler, defaultErrorHandler, validationErrorHandler };
