import serverlessExpress from "@codegenie/serverless-express";
import { APIGatewayProxyEventV2, Callback, Context } from "aws-lambda";
import app from ".";

const handlerFunction = serverlessExpress({ app });

export const handler = (
  event: APIGatewayProxyEventV2,
  context: Context,
  callback: Callback,
) => {
  // Strips stage path prefix (e.g. '/default' path segment) so that the request path
  // is valid when using custom domains with API Gateway V2 event source
  event.rawPath = event.rawPath.substring(
    `/${event.requestContext.stage}`.length,
  );
  console.log(JSON.stringify(event));
  return handlerFunction(event, context, callback);
};
