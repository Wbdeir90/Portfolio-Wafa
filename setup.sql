-- Create the database
CREATE DATABASE portfolio_wafa_main;

-- Select the database to use
USE pportfolio_wafa_main;

CREATE TABLE contact_form (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    message TEXT
);
CREATE TABLE IF NOT EXISTS contact_form (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    message TEXT
);

