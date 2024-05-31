import amqp from "amqplib";
// import { config } from "./config";
// import config from "./config";

interface MessageProps {
  id: string;
  profilePic: string;
  messageInfo: string;
}

const rabbitMQ = {
  url: "amqp://localhost",
  exchangeName: "logExchange",
};

class Producer {
  channel!: amqp.Channel;

  async createChannel() {
    const connection = await amqp.connect(rabbitMQ.url);
    this.channel = await connection.createChannel();
  }

  async publishMsg(routingKey: string, message: MessageProps) {
    if (!this.channel) {
      await this.createChannel();
    }
    const exchangeName = rabbitMQ.exchangeName;
    await this.channel.assertExchange(exchangeName, "direct");
    await this.channel.publish(
      exchangeName,
      routingKey,
      Buffer.from(
        JSON.stringify({
          logType: routingKey,
          message: message,
          dateTime: new Date(),
        })
      )
    );
    console.log(`The message ${message} is sent to ${exchangeName}`);
  }
}

export default Producer;
