-- Create the database
CREATE DATABASE permalist;

-- Select the database to use
USE permalist;

-- Create the contact_form table
CREATE TABLE contact_form (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL
);
