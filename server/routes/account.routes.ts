import express from "express";
import { getAllAccounts } from "../controllers/account.controller";

const accountRouter = express.Router();

accountRouter.get("/", getAllAccounts);

export default accountRouter;
