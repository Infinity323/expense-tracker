import serverlessExpress from "@codegenie/serverless-express";
import app from ".";

export const handler = (event, context) => {
  console.log(JSON.stringify(event));
  return serverlessExpress({
    app,
  });
};
