import express from "express";
import {
  createAccessToken,
  createLink,
  createLinkToken,
  getAllAccessTokens,
} from "../controllers/link.controller";

const linkRouter = express.Router();

linkRouter.post("/link-token", createLinkToken);

linkRouter
  .route("/access-token")
  .get(getAllAccessTokens)
  .post(createAccessToken);

linkRouter.post("/", createLink);

export default linkRouter;
