import KafkaConfig from "./config.js";

const sendMessageToKafka = async (req, res) => {
  try {
    const { message } = req.body;
    console.log(message, " ", req.body);
    const messages = [{ value: JSON.stringify(req.body) }];
    const kafkaConfig = new KafkaConfig();
    console.log(messages);

    // if (!message) {
    //   return res.status(400).json({ error: "Message field is missing or undefined" });
    // }

    kafkaConfig.produce("my-topic1", messages);

    res.status(200).json({
      status: "Ok!",
      message: "Message successfully send!",
    });
  } catch (error) {
    console.log(error);
  }
};

const constrollers = { sendMessageToKafka };

export default constrollers;