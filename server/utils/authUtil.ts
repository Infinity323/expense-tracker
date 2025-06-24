import { Request } from "express";

export const getUserId = (req: Request): string | null => {
  const authHeader =
    req.headers["authorization"] || (req.headers["Authorization"] as string);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.split(" ")[1];
  const payload = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );
  return payload.sub;
};
