import express from "express";
import collectionController from "../controllers/collectionController.js";
import { authenticateToken } from "../middlewares/auth.js";

const router = express.Router();

router.post(
  "/collection/add-item",
  authenticateToken,
  collectionController.addCollectionItem
);
router.put(
  "/collection/update-item/:id",
  authenticateToken,
  collectionController.updateCollectionItem
);
router.delete(
  "/collection/:id",
  authenticateToken,
  collectionController.deleteCollectionItem
);
router.get(
  "/collection/user/:user_id",
  collectionController.getCollectionByUserId
);
export default router;
