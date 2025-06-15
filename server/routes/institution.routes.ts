import express from "express";
import { getLinkedInstitutions } from "../controllers/institution.controller";

const institutionRouter = express.Router();

institutionRouter.route("/linked").get(getLinkedInstitutions);

export default institutionRouter;
