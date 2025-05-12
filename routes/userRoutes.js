import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router();

router.get("/", userController.getAllUsers);
router.post("/register", userController.register);
router.post("/login", userController.login);


export default router;
