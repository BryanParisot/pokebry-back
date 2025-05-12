import db from "../db.js";

const getAllRarities = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, name FROM rarities");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

export default {
    getAllRarities
}