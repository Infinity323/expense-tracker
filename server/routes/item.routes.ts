import express from "express";
import {
  deleteItem,
  getAllItems,
  updateItem,
} from "../controllers/item.controller";

const itemRouter = express.Router();

itemRouter.get("/", getAllItems);

itemRouter.route("/:id").put(updateItem).delete(deleteItem);

export default itemRouter;
