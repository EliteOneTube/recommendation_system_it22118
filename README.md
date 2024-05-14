
# Reaserch
## Tech Stack

**Server:** Node, Express

**Database:** MongoDB


## Tech Stack Versions
- **Node.js**: `v20.9.0`
- **npm**: `10.5.2`
- **MongoDB**: `7.0.6`
  
## Installation Development / Production(without Docker)

- Install [NodeJS](https://nodejs.org/en/download/package-manager#installing-nodejs-via-package-manager)

- Install [MongoDB](https://www.mongodb.com/docs/manual/administration/install-community/)    
## Environment Variables

### Backend Folder

&emsp; `template.env` file includes `PORT` which defaults to 3000 if not entered, `STORE_PATH` which will default to a database named bet_app locally and `KAFKA_URL` which defaults to localhost:9092. After you are done with the file rename it to `.env`

## Running

### Development

To install the dependecies
```bash
  npm install
```

To start the development application
```bash
  npm run start:dev
```
### Test

To run the test
```bash
  npm run test
```

### Production

#### Not using Docker

To install the dependecies
```bash
  npm install
```

To build the production application
```bash
  npm run build
```

To start the production application
```bash
  npm run start
```

#### Using Docker

To start the production application
```bash
  docker-compose up -d
```

## Data Generator

To generate data for the application, run the following command (Will send data to the endpoints of the application)
```bash
  npm run generator
```

## Authors

- [@EliteOneTube](https://github.com/EliteOneTube)

