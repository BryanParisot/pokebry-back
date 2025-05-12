import express from "express";
import ItemController from "../controllers/ItemController.js";

const router = express.Router();

router.get("/collection/items", ItemController.getAllItems);

export default router;
