import { CognitoJwtVerifier } from "aws-jwt-verify";
import * as dotenv from "dotenv";
import { RequestHandler } from "express";

dotenv.config();

const userPoolId = process.env.COGNITO_USER_POOL_ID;
const clientId = process.env.COGNITO_CLIENT_ID;

if (!userPoolId || !clientId) {
  throw new Error(
    "COGNITO_USER_POOL_ID and COGNITO_CLIENT_ID must be configured before starting the server",
  );
}

const verifier = CognitoJwtVerifier.create({
  userPoolId,
  tokenUse: "access",
  clientId,
});

const authorizeUser: RequestHandler = async (req, res, next) => {
  const match = req.get("authorization")?.match(/^Bearer\s+(\S+)$/i);

  if (!match) {
    res.status(401).json({ message: "Authorization header missing" });
    return;
  }

  try {
    const payload = await verifier.verify(match[1]);
    req.verifiedCognitoJWT = payload;
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export default authorizeUser;
