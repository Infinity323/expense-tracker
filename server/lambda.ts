import serverlessExpress from "@codegenie/serverless-express";
import { APIGatewayProxyEventV2, Callback, Context } from "aws-lambda";
import app from ".";

const handlerFunction = serverlessExpress({ app });

export const handler = (
  event: APIGatewayProxyEventV2,
  context: Context,
  callback: Callback,
) => {
  const stagePrefix = `/${event.requestContext.stage}`;
  if (event.rawPath === stagePrefix) {
    event.rawPath = "/";
  } else if (event.rawPath.startsWith(`${stagePrefix}/`)) {
    event.rawPath = event.rawPath.slice(stagePrefix.length);
  }
  return handlerFunction(event, context, callback);
};
