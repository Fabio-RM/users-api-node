# Node.JS Users API

A very simple API that provides user creation and login using JWT.

It can be implemented using the code available via npm or using Docker. The main objective is to serve as a microservice for integration with other projects.

## Prerequisites

- Node.JS
- MySQL

or:

- Docker with Docker Compose

## Installation

#### 1. Using npm

Clone the repository:
`git clone https://github.com/Fabio-RM/users-api-node.git`

Install dependencies and compile TypeScript:
```
cd users-api-node/app
npm install -y
npx tsc
```

Inside de 'app' folder, rename the '.env.exemple' file to '.env' and configure the database parameters according to your environment.

Make the Sequelize migrations:
`npx sequelize-cli db:migrate`

Run it:
`npm start`

#### 2. Using Docker Compose

Clone the repository:
`git clone https://github.com/Fabio-RM/users-api-node.git`

Rename the '.env.exemple' file to '.env' and configure the database parameters according to your environment.

Run Docker Compose:
`docker-compose up -d`

Wait until MySQL service is up, then connect to the users-api-service container:
`docker-compose run --rm users-api-service sh`

And run the Sequelize migrations:
`npx sequelize-cli db:migrate`

## How to use the API

There are only 2 routes:

- /api/v1/users/create: used for create a new user
- /api/v1/users/login: used for receive a JWT if user's credentials are correct

#### Create user

You need to send a POST request with a JSON with the following parameters:
```
{
  "name": "User's Name",
  "email": "Some email",
  "password": "Some password"
}
```

The response should return the data of the user that was just created.

#### Login user

You need to send a POST request with a JSON with the following parameters:  
```
{
  "email": "Some existing email",
  "password": "Some correct password"
}
```

The response should return a JSON with a JWT token.
