
-- Création de la base
CREATE DATABASE IF NOT EXISTS pokemon_collection;
USE pokemon_collection;

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

-- Table collection d'objets
CREATE TABLE collection (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(255),
    edition VARCHAR(100),
    item_type_id INT,
    rarity_id INT,
    quality INT,
    purchase_price DECIMAL(10, 2),
    estimated_value DECIMAL(10, 2),
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (item_type_id) REFERENCES item_types(id),
    FOREIGN KEY (rarity_id) REFERENCES rarities(id),
    FOREIGN KEY (quality_id) REFERENCES qualities(id)
);

INSERT INTO item_types (id, name) VALUES (1, 'Booster');
INSERT INTO item_types (id, name) VALUES (2, 'Tripack');
INSERT INTO item_types (id, name) VALUES (3, 'Duo Pack');
INSERT INTO item_types (id, name) VALUES (4, 'Boîte Premium');
INSERT INTO item_types (id, name) VALUES (5, 'Coffret Classeur');
INSERT INTO item_types (id, name) VALUES (6, 'ETB (Elite Trainer Box)');
INSERT INTO item_types (id, name) VALUES (7, 'Display');
INSERT INTO item_types (id, name) VALUES (8, 'UPC (Ultra Premium Collection)');
INSERT INTO item_types (id, name) VALUES (9, 'Coffret Spécial');
INSERT INTO item_types (id, name) VALUES (10, 'Mini-Tin');
INSERT INTO item_types (id, name) VALUES (11, 'Tin (Boîte Métallique)');
INSERT INTO item_types (id, name) VALUES (12, 'Deck Thématique');
INSERT INTO item_types (id, name) VALUES (13, 'Bundle de Boosters');
INSERT INTO item_types (id, name) VALUES (14, 'Pack de 3 Boosters + Carte Promo');
INSERT INTO item_types (id, name) VALUES (15, 'Pack de Pré-Release');
INSERT INTO item_types (id, name) VALUES (16, 'Blister');
INSERT INTO item_types (id, name) VALUES (17, 'Collection Célébration');
INSERT INTO item_types (id, name) VALUES (18, 'Porte-cartes');
INSERT INTO item_types (id, name) VALUES (19, 'Box d’Accessoires');
INSERT INTO item_types (id, name) VALUES (20, 'Pack Cadeau');
INSERT INTO rarities (id, name) VALUES (1, 'Commune');
INSERT INTO rarities (id, name) VALUES (2, 'Peu Commune');
INSERT INTO rarities (id, name) VALUES (3, 'Rare');
INSERT INTO rarities (id, name) VALUES (4, 'Ultra Rare');
INSERT INTO rarities (id, name) VALUES (5, 'Secrète');
INSERT INTO rarities (id, name) VALUES (6, 'Promo');
INSERT INTO rarities (id, name) VALUES (7, 'Légendaire');
INSERT INTO rarities (id, name) VALUES (8, 'Mythique');
INSERT INTO rarities (id, name) VALUES (9, 'Holo');
INSERT INTO rarities (id, name) VALUES (10, 'Reverse Holo');
INSERT INTO rarities (id, name) VALUES (11, 'Full Art');
INSERT INTO rarities (id, name) VALUES (12, 'Gold');
INSERT INTO rarities (id, name) VALUES (13, 'Texturée');
INSERT INTO rarities (id, name) VALUES (14, 'Shiny');
INSERT INTO rarities (id, name) VALUES (15, 'Illustration Alternative');
