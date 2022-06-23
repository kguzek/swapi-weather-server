CREATE DATABASE `server`;
CREATE TABLE `server`.`users` (
  `uuid` VARCHAR(36) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NOT NULL,
  `modified_at` DATETIME NOT NULL,
  `hash` VARCHAR(255) NOT NULL,
  `salt` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`uuid`)
);
CREATE TABLE `server`.`weather` ();