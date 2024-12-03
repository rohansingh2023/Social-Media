import amqp from "amqplib";
import { Logger } from "log4u";

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
  log4u: Logger = new Logger({serviceName:"GraphQL"});

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
    this.log4u.log({type:"DEBUG", message:`The message ${message} is sent to ${exchangeName}`})
  }
}

export default Producer;
