declare global {
  namespace Express {
    interface Request {
      verifiedCognitoJWT?: {
        sub: string;
      };
    }
  }
}

export {};