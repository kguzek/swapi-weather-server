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
CREATE TABLE `server`.`sw_people` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `birth_year` VARCHAR(16) NOT NULL,
  `eye_color` VARCHAR(16) NOT NULL,
  `gender` VARCHAR(16) NOT NULL,
  `hair_color` VARCHAR(16) NOT NULL,
  `height` VARCHAR(8) NOT NULL,
  `mass` VARCHAR(8) NOT NULL,
  `skin_color` VARCHAR(32) NOT NULL,
  PRIMARY KEY (`id`)
);