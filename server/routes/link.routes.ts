import express from "express";
import {
  createAccessToken,
  createLinkToken,
  getAllAccessTokens,
} from "../controllers/link.controller";

const linkRouter = express.Router();

linkRouter.post("/link-token", createLinkToken);

linkRouter
  .route("/access-token")
  .get(getAllAccessTokens)
  .post(createAccessToken);

export default linkRouter;
