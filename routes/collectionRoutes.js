import express from "express";
import multer from "multer"; // <== Ajout
import collectionController from "../controllers/collectionController.js";
import { authenticateToken } from "../middlewares/auth.js";

const router = express.Router();

// Config de multer pour stocker l'image en mémoire (nécessaire pour S3)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  "/collection/add-item",
  authenticateToken,
  upload.single("image"), // 👈 Ici on intercepte l'image du form-data
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
router.get(
  "/collection/distribution/:user_id",
  collectionController.getItemTypeDistribution
);

export default router;
