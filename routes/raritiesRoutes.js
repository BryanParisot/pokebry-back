import express from "express";
import raritiesController from "../controllers/raritiesController.js";

const router = express.Router();

router.get("/collection/rarities", raritiesController.getAllRarities);

export default router;
