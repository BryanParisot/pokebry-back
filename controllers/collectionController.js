import AWS from "aws-sdk";
import dotenv from "dotenv";
import db from "../db.js";
dotenv.config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

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
      image_url: imageUrlFromBody, // si fourni en tant qu'URL texte
    } = req.body;

    const file = req.file; // image fichier
    const user_id = req.user.id;

    // Vérifications de base
    if (
      !user_id ||
      !name ||
      !item_type_id ||
      !purchase_price ||
      !estimated_value
    ) {
      return res.status(400).json({
        message: "Tous les champs obligatoires doivent être renseignés.",
      });
    }

    let finalImageUrl;

    if (file) {
      // Cas 1 : fichier image → upload dans S3
      const s3Params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `collection-images/${Date.now()}-${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
        //ACL: "public-read",
      };

      const uploadResult = await s3.upload(s3Params).promise();
      finalImageUrl = uploadResult.Location;
    } else if (imageUrlFromBody && imageUrlFromBody.startsWith("http")) {
      // Cas 2 : une URL valide est fournie
      finalImageUrl = imageUrlFromBody;
    } else {
      return res.status(400).json({
        message:
          "Une image doit être fournie, soit via un fichier, soit via une URL valide.",
      });
    }

    const [result] = await db.execute(
      `INSERT INTO collection 
        (user_id, name, edition, item_type_id, rarity_id, quality, purchase_price, estimated_value, image_url) 
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
        finalImageUrl,
      ]
    );

    res.status(201).json({
      message: "Élément ajouté avec succès.",
      itemId: result.insertId,
      image_url: finalImageUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur du serveur lors de l'ajout de l'élément.",
    });
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

    const [rows] = await db.execute(
      `SELECT * FROM collection WHERE id = ? AND user_id = ?`,
      [itemId, userId]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Élément non trouvé après mise à jour." });
    }

    const updatedCard = rows[0];
    return res.status(200).json(updatedCard); // 👈 On renvoie l’objet complet
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

const deleteCollectionItem = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

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
  const { user_id } = req.params;

  try {
    const [rows] = await db.execute(
      `
      SELECT 
        c.id,
        c.name,
        c.image_url,
        c.purchase_price,
        c.estimated_value,
        c.created_at,
        c.quality,
        c.edition,
        r.name AS rarity,
        it.name AS item_type
      FROM collection c
      JOIN rarities r ON c.rarity_id = r.id
      JOIN item_types it ON c.item_type_id = it.id
      WHERE c.user_id = ?
      `,
      [user_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Aucun élément trouvé." });
    }

    res.status(200).json({ collection: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur serveur lors de la récupération de la collection.",
    });
  }
};

export const getItemTypeDistribution = async (req, res) => {
  const { user_id } = req.params;

  try {
    const [rows] = await db.execute(
      `SELECT it.name AS item_types, COUNT(*) AS count
       FROM collection c
       JOIN item_types it ON c.item_type_id = it.id
       WHERE c.user_id = ?
       GROUP BY it.name`,
      [user_id]
    );

    res.status(200).json({ distribution: rows });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération de la distribution." });
  }
};

export default {
  addCollectionItem,
  updateCollectionItem,
  deleteCollectionItem,
  getCollectionByUserId,
  getItemTypeDistribution,
};
