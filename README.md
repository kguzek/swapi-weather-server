# SWAPI Weather Server

## Introduction
This is a repository containing the source code of a Node.js server designed as a recruitment task.

## Installation & Setup

### Dependencies
The package manager used in this project is stock NPM, meaning that after cloning the repo, the command `npm install` must be run in the project root directory in order to install all third-party project dependencies.

### Database
A MySQL server instance must be installed and running for the program to work. After logging in as the root/admin account, execute the code contained in the `scripts` folder. Make sure to change the password in `CREATE_USER.sql`.

### Environment variables
In the project root directory there is a `template.env` file containing all the environment variables needed for the program to run successfully. These may either be set on the OS level or in a `.env` file, since the program automatically detects those.

In order to obtain an key for the OpenWeatherMap API, an account must be created on https://home.openweathermap.org/users/sign_up. Then, the API key will both be sent by e-mail and visible on [your profile](https://home.openweathermap.org/api_keys).


## Running the server
In order to start the HTTP server, run the `index.ts` file using Node.js:
<p style="text-align: center;" align="center"><code>npx ts-node index</code></p>

## Endpoints
### **POST** /register
Requests to this endpoint must be made with a JSON payload containing `email` and `password` fields. The server then hashes, salts and peppers the password and stores the credentials in the `users` database table. Then, a JSON Web Token (JWT) is generated and sent back to the user along with the user details. The client must store this token in order to be recognised as logged in when performing subsequent requests.

### **POST** /login
Requests to this endpoint must be made in the same way as to `/register`. The server validates the credentials are the same as in the database, and also generates a JWT that should be used by the client.

### **GET** /starwars/getall
This endpoint returns a list of all people on the Star Wars API (SWAPI). It fetches all pages, then stores each person as a separate entry in the `sw_people` database table. Requests made after the first request are served using the data from the database, rather than from the SWAPI, since it is unlikely to change.

### **GET** /starwars/getfiltered
The fact that the people are stored in a MySQL database also allows for complex querying. Requests to this endpoint should contain key-value pairs in the query string to denote what attributes each return person should have. For example, a request with signature `/starwars/getfiltered?gender=male&skin_color=fair` will return only male Star Wars characters with fair skin.

### **GET** /weather/get
The server queries the OpenWeatherMap API at the beginning of every hour and stores the returned information in the `weather` table of the database. Requests to this endpoint return the data retrieved from the most recent database entry.

## Authorisation
The endpoints `/starwars/getfiltered` as well as `/weather/get` are only accessible if the client presents a JWT that was obtained during registration or logging in. The JWT must be sent in plaintext in the `Authorization` header, following a `Bearer` string literal separated by a space.