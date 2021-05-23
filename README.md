# Project Title

Simple Shopping Cart

## Requirements

For development, you will only need Node.js and a node global package.

### Node

- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
  Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      `$ sudo apt update`
      `$ sudo apt install nodejs`

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    `$ node --version`
     v14.17.0

    `$ npm --version`
     6.17.0

## Project Content

This project contains

- Typescript
- prettier code formatter
- nodemon for automatic restart
- redis for caching
- eslint
- jest for testing
- express
- winston for logging

## Setup

1.- Clone the project from github
`$ git clone https://github.com/chrischeks/shopping-cart.git`
`$ cd shopping-cart`
`$ npm install`

2.- Setup your IDE (if you didn't already):

- Enable typescript to read from tsconfig.json
- Enable eslint to read from .eslintrc

  3.- Setup the project

**Run all the following commands in the root of your project**

### Start the app in dev mode

`$ npm run dev`

### Running Tests

`$ npm run test`

### Start the app in production

`$ npm start`

## Environment Variable

- Create a .env file in the root of the project and add your port number
  `PORT=3000`

## Database

- Mysql was used as the database and the configuration can be found in the `src/configs` directory.

- To run the app in production, you will need to create a `production.json` file similar to the `development.json` or `test.json` files in the `src/configs` directory.

## Typescript

### Documentation

Typescript documentation can be found at http://www.typescriptlang.org/docs/tutorial.html

### Configuration

Typescript configuration can be found at http://www.typescriptlang.org/docs/handbook/tsconfig-json.html

## Some Packages installed

### redis

A high performance Node.js Redis client.
Documentation available at https://www.npmjs.com/package/redis.

### jest

Jest is a delightful JavaScript Testing Framework with a focus on simplicity.
Documentation available at https://jestjs.io/.

### express

Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
More information is available at http://expressjs.com/.

### helmet

Help secure Express apps with various HTTP headers. Documentation can be found at https://github.com/helmetjs/helmet.

### winston

A simple and universal logging library. Documentation can be found at https://github.com/winstonjs/winston.

### typeorm

TypeORM is an ORM that can run in NodeJS, Browser, Cordova, PhoneGap, Ionic, React Native, NativeScript, Expo, and Electron platforms and can be used with TypeScript and JavaScript (ES5, ES6, ES7, ES8).
Documentation can be found at https://typeorm.io/#/

### cross-env:

Run scripts that set and use environment variables across platforms.
Documentation can be found at https://www.npmjs.com/package/cross-env

### hpp

Express middleware to protect against HTTP Parameter Pollution attacks.
Documentation can be found at https://www.npmjs.com/package/hpp

#### class-validator

Allows use of decorator and non-decorator based validation. Documentation can be found at https://www.npmjs.com/package/class-validator

### bcrypt

A library to help you hash passwords. Documentation can be found at https://www.npmjs.com/package/bcrypt.

### nodemon

Nodemon is a utility that will monitor for any changes in your source and automatically restart the server. Documentation can be found at http://nodemon.io/.
