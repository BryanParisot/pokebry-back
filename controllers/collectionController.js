import db from "../db.js";

// Ajouter un élément à la collection
export const addCollectionItem = async (req, res) => {
  try {
    const {
      name,
      edition,
      item_type_id,
      rarity_id,
      quality,
      purchase_price,
      estimated_value,
      image_url,
    } = req.body;

    const user_id = req.user.id; // ID récupéré depuis le token

    if (
      !user_id ||
      !name ||
      !item_type_id ||
      !purchase_price ||
      !estimated_value ||
      !image_url
    ) {
      return res.status(400).json({
        message: "Tous les champs nécessaires doivent être renseignés.",
      });
    }

    const [result] = await db.execute(
      `INSERT INTO collection (user_id, name, edition, item_type_id, rarity_id, quality, purchase_price, estimated_value, image_url) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        name,
        edition,
        item_type_id,
        rarity_id,
        quality,
        purchase_price,
        estimated_value,
        image_url,
      ]
    );

    res.status(201).json({
      message: "Élément ajouté à la collection avec succès.",
      itemId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur du serveur lors de l'ajout de l'élément." });
  }
};

export const updateCollectionItem = async (req, res) => {
  const itemId = req.params.id;
  const userId = req.user.id;
  const {
    name,
    edition,
    item_type_id,
    rarity_id,
    quality,
    purchase_price,
    estimated_value,
    image_url,
  } = req.body;

  try {
    const [result] = await db.execute(
      `UPDATE collection
       SET name = ?, edition = ?, item_type_id = ?, rarity_id = ?, quality = ?, purchase_price = ?, estimated_value = ?, image_url = ?
       WHERE id = ? AND user_id = ?`,
      [
        name,
        edition,
        item_type_id,
        rarity_id,
        quality,
        purchase_price,
        estimated_value,
        image_url,
        itemId,
        userId,
      ]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Élément introuvable ou non autorisé." });
    }

    res.status(200).json({ message: "Élément mis à jour avec succès." });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur." });
  }
};

const deleteCollectionItem = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // récupéré via verifyToken

  try {
    // Récupère l'élément et vérifie qu’il appartient au user
    const [rows] = await db.execute(
      "SELECT * FROM collection WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (rows.length === 0) {
      return res.status(403).json({
        message:
          "Action interdite : vous ne pouvez supprimer que vos propres éléments.",
      });
    }

    await db.execute("DELETE FROM collection WHERE id = ?", [id]);

    res.status(200).json({ message: "L'élément a été supprimé avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};

// Récupérer la collection d'un utilisateur
export const getCollectionByUserId = async (req, res) => {
  const { user_id } = req.params; // Récupère l'user_id depuis l'URL

  try {
    const [rows] = await db.execute(
      "SELECT * FROM collection WHERE user_id = ?",
      [user_id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Aucun élément trouvé dans la collection." });
    }

    res.status(200).json({ collection: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur du serveur lors de la récupération de la collection.",
    });
  }
};

export default {
  addCollectionItem,
  updateCollectionItem,
  deleteCollectionItem,
  getCollectionByUserId,
};
