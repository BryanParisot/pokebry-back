-- Création de la base
CREATE DATABASE IF NOT EXISTS pokemon_collectionn;
USE pokemon_collectionn;

-- Table des utilisateurs
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des types d’objets (carte, booster, item...)
CREATE TABLE item_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50)
);

-- Table des raretés
CREATE TABLE rarities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50)
);

-- Table collection d'objets (corrigée sans qualité_id)
CREATE TABLE collection (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(255),
    edition VARCHAR(100),
    item_type_id INT,
    rarity_id INT,
    quality INT, -- Note de 1 à 10
    purchase_price DECIMAL(10, 2),
    estimated_value DECIMAL(10, 2),
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (item_type_id) REFERENCES item_types(id),
    FOREIGN KEY (rarity_id) REFERENCES rarities(id)
);

-- Données item_types
INSERT INTO item_types (id, name) VALUES
(1, 'Booster'), (2, 'Tripack'), (3, 'Duo Pack'), (4, 'Boîte Premium'),
(5, 'Coffret Classeur'), (6, 'ETB (Elite Trainer Box)'), (7, 'Display'),
(8, 'UPC (Ultra Premium Collection)'), (9, 'Coffret Spécial'), (10, 'Mini-Tin'),
(11, 'Tin (Boîte Métallique)'), (12, 'Deck Thématique'), (13, 'Bundle de Boosters'),
(14, 'Pack de 3 Boosters + Carte Promo'), (15, 'Pack de Pré-Release'),
(16, 'Blister'), (17, 'Collection Célébration'), (18, 'Porte-cartes'),
(19, 'Box d’Accessoires'), (20, 'Pack Cadeau');

-- Données rarities
INSERT INTO rarities (id, name) VALUES
(1, 'Commune'), (2, 'Peu Commune'), (3, 'Rare'), (4, 'Ultra Rare'), (5, 'Secrète'),
(6, 'Promo'), (7, 'Légendaire'), (8, 'Mythique'), (9, 'Holo'), (10, 'Reverse Holo'),
(11, 'Full Art'), (12, 'Gold'), (13, 'Texturée'), (14, 'Shiny'), (15, 'Illustration Alternative');

-- Faux utilisateur
INSERT INTO users (first_name, last_name, email, password)
VALUES ('Ash', 'Ketchum', 'ash@pokemon.com', 'pikachu123');

-- Données factices dans collection
INSERT INTO collection (user_id, name, edition, item_type_id, rarity_id, quality, purchase_price, estimated_value, image_url)
VALUES
(1, 'Pikachu VMAX', 'Épée et Bouclier', 1, 4, 9, 15.00, 25.00, 'https://images.pokemontcg.io/swsh4/44_hires.png'),
(1, 'Dracaufeu GX', 'Soleil et Lune', 4, 5, 10, 30.00, 60.00, 'https://images.pokemontcg.io/sm60/SM60_hires.png'),
(1, 'Mewtwo VSTAR', 'Stars Étincelantes', 6, 12, 8, 40.00, 70.00, 'https://images.pokemontcg.io/swsh9/31_hires.png'),
(1, 'Rayquaza VMAX', 'Ciel Rugissant', 7, 13, 7, 20.00, 35.00, 'https://images.pokemontcg.io/swsh7/110_hires.png'),
(1, 'Evoli Full Art', 'Destinées Radieuses', 11, 11, 6, 12.00, 22.00, 'https://images.pokemontcg.io/shf/SV044_hires.png');
