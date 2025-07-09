import cors from "cors";
import express from "express";
import collectionRoutes from "./routes/collectionRoutes.js";
import itemsRoutes from "./routes/itemsRoutes.js";
import raritiesRoutes from "./routes/raritiesRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import stripeRouter from "./routes/stripe.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api", collectionRoutes);
app.use("/api", raritiesRoutes);
app.use("/api", itemsRoutes);
app.use("/api/stripe", stripeRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Erreur serveur inattendue." });
});
