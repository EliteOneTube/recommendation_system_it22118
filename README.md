
# Reaserch

## Project Description

This project builds a recommendation system that leverages real-time data processing to provide users with personalized suggestions.

### Client Data Flow:

- Clients interact with the system through APIs, sending their data (e.g., users, coupons, events).

- API Gateway: These requests are received by the API gateway, a central entry point for client requests.

- Kafka Producers: The API translates the data into messages and sends them to specific topics within Apache Kafka, a distributed streaming platform.

### Diagram of the System Architecture:
![System Architecture](diagrams/Recommendation%20System.png)

### Data Processing with Kafka and MongoDB:

- Apache Kafka: Kafka acts as a high-throughput, low-latency messaging queue. It efficiently handles the large volume of data streams from clients, ensuring scalability and real-time processing.
- Kafka Consumers: These consumers continuously read messages from relevant Kafka topics. They can be scaled horizontally to handle increasing data loads.

### Data Storage with MongoDB:

- MongoDB: The processed data is then stored in MongoDB, a NoSQL document database. MongoDB's flexible schema allows for efficient storage of diverse data types (users, coupons, events) generated by the system.

### Justification for Technology Choices:
- Kafka: This project utilizes real-time data to personalize recommendations. Kafka's ability to handle high-velocity data streams is crucial for ingesting client data and feeding it into the processing pipeline.

- MongoDB: The project deals with various data types, including user preferences, product information, and potentially evolving recommendation algorithms. MongoDB's flexible schema and ability to store semi-structured data make it a suitable choice for this dynamic data environment.
This architecture allows for continuous data processing and real-time updates to user recommendations, providing a more personalized and engaging user experience.

### Recommendation Algorithm:
- The recommendation algorithm uses similarity-based collaborative filtering to suggest events to users. It calculates the similarity between users based on their interactions with items (users, coupons, events) and recommends events that similar users have interacted with.

### Load Balancing and Scalability:
  1. Kafka Consumers: Every 60 minutes, the system checks the requests per endpoint and scales the number of consumers accordingly. This ensures that the system can handle varying data loads efficiently.

## Tech Stack

**Server:** Node, Express

**Database:** MongoDB

**Message Broker:** Kafka

## Tech Stack Versions
- **Node.js**: `v20.9.0`
- **npm**: `10.5.2`
- **MongoDB**: `Latest Docker Image`
- **CP-Kafka**: `Latest Docker Image`

## Environment Variables

&emsp; `template.env` file includes `PORT` which defaults to 8080, `STORE_PATH` which will default to a database named bet_app locally and `KAFKA_URL` which defaults to kafka:29092. After you are done with the file rename it to `.env`

**Note:** The .env file is not included in the repository for security reasons. You can create your own .env file using the template.env file. For the application to work properly, you need to provide the required environment variables in the .env file before running the docker-compose up command.

## Running

**Important: Before running the application in development or testing phase, make sure you have the following services installed and running on your machine**
- **MongoDB**
- **Kafka**
- **Zookeeper**
- **Node.js**

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

#### Using Docker

To start the production application
```bash
  docker-compose up -d
```

Verify the deployment by navigating to your server address in your preferred browser.

```bash
  http://localhost:8080/ping
```

## Endpoints


You can find the available endpoints at [Endpoints](https://documenter.getpostman.com/view/10485656/2sA3Qza8vW)


## Data Generator

To generate data for the application, run the following command (Will send data to the endpoints of the application). The first argument is the base url of the application and the second argument is the number of data to generate. The values used in the example are also the default values.
```bash
  npm run generator http://localhost:8080 1000
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

The MIT License is a permissive open-source license that allows for for-profit and non-profit use, redistribution, modification, and commercial distribution of the licensed software and its derivatives. By contributing to this project, you agree to the terms of the MIT License.

## Authors

- [@EliteOneTube](https://github.com/EliteOneTube)

