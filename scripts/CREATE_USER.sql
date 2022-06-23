CREATE USER 'api' @'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON server.* TO 'api' @'localhost';
FLUSH PRIVILEGES;