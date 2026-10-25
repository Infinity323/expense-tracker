import { Request } from "express";

export const getUserId = (req: Request): string => {
  const userId = req.verifiedCognitoJWT?.sub;
  if (!userId) {
    throw new Error("Verified Cognito subject is missing");
  }
  return userId;
};
