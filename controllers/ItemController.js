import db from "../db.js";

const getAllItems = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, name FROM item_types");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

export default {
  getAllItems,
};
