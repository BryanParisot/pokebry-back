import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../db.js";

export const register = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users (first_name, last_name, email, password)
      VALUES (?, ?, ?, ?)
    `;

    await db.execute(sql, [first_name, last_name, email, hashedPassword]);

    res.status(201).json({ message: "Utilisateur inscrit avec succès !" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Email déjà utilisé." });
    }
    console.error(err);
    res.status(500).json({ message: "Erreur lors de l'inscription." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Champs requis." });

  try {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect." });
    }

    const user = users[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET, 
      { expiresIn: "2h" }
    );

    res.status(200).json({
      message: "Connexion réussie.",
      user: { id: user.id, first_name: user.first_name, email: user.email },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, first_name, last_name, email FROM users"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

export default {
  getAllUsers,
  register,
  login,
};
