//server/analytics_services/index.js
import bodyParser from "body-parser";
import express from "express";
import constrollers from "./controller.js";
import KafkaConfig from "./config.js";

const app = express();
app.use(express.json());  // For parsing application/json
app.use(express.urlencoded({ extended: false })); 

app.post("/api/send", constrollers.sendMessageToKafka);

// consume from topic "test-topic"
const kafkaConfig = new KafkaConfig();
kafkaConfig.consume("my-topic1", (value) => {
  console.log("📨 Receive message: ", value);
});

app.listen(3000, () => {
  console.log(`Server is running on port 8080.`);
});
