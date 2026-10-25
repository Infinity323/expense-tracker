export interface PlaidErrorLogContext {
  operation: string;
  item_id?: string;
  account_id?: string;
  account_ids?: string[];
  link_session_id?: string;
  institution_id?: string;
}

export const logPlaidApiError = (
  error: unknown,
  context: PlaidErrorLogContext,
) => {
  const plaidError = error as {
    name?: string;
    code?: string;
    response?: {
      status?: number;
      data?: {
        error_type?: string;
        error_code?: string;
        request_id?: string;
        item_id?: string;
        account_id?: string;
      };
    };
  };
  const data = plaidError.response?.data;

  console.error(
    "[Plaid API error]",
    JSON.stringify({
      ...context,
      item_id: data?.item_id ?? context.item_id,
      account_id: data?.account_id ?? context.account_id,
      error_type: data?.error_type,
      error_code: data?.error_code ?? plaidError.code,
      request_id: data?.request_id,
      http_status: plaidError.response?.status,
      error_name: plaidError.name,
    }),
  );
};