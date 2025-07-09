// routes/stripe.ts

import express from "express";
import Stripe from "stripe";
import bodyParser from "body-parser";


const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

const PREMIUM_PRICE_ID = "price_1RiKyAQtuISh0ECo6c4951Xd";
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;


router.post("/create-checkout-session", async (req, res) => {
  const { userId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: PREMIUM_PRICE_ID,
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId.toString(),
      },
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Erreur Stripe :", error);
    res.status(500).json({ error: "Erreur lors de la création de la session" });
  }
});


router.post("/webhook", bodyParser.raw({ type: "application/json" }), (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata.userId;

    console.log("Paiement validé pour l'utilisateur ID :", userId);

    // 🔄 Mets à jour ton user en base de données ici
    // Par exemple : await updateUserPremiumStatus(userId, true);
  }

  res.status(200).json({ received: true });
});


export default router;
