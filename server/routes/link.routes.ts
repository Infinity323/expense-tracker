import express from "express";
import { createAccessToken, createLinkToken } from "../controllers/link.controller";

const linkRouter = express.Router();

linkRouter.post("/link-token", createLinkToken);

linkRouter.post("/access-token", createAccessToken);

export default linkRouter;
