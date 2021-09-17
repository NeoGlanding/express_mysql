CREATE USER 'skilvuljaya'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Sk1lvulJ@y@'

CREATE DATABASE address_book;

USE address_book;

GRANT ALL PRIVILEGES ON address_book.* TO 'skilvuljaya'@'localhost';

FLUSH PRIVILEGES;

CREATE TABLE contacts (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nama VARCHAR(50),
    perusahaan VARCHAR(50),
    email VARCHAR(50),
    nomor_telefon VARCHAR(13)
);

CREATE TABLE groups_ ( -- saya tambahkan underscore, karena tidak bisa buat tabel dengan nama groups
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nama VARCHAR(50)
);

CREATE TABLE groups_contact (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    group_id INT,
    contact_id INT,
    FOREIGN KEY (group_id) REFERENCES groups_(id) ON DELETE CASCADE,
    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
);