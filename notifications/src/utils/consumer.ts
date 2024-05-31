import amqp from "amqplib";

const rabbitMQ = {
  url: "amqp://localhost",
  exchangeName: "logExchange",
};

class Consumer {
  channel!: amqp.Channel;

  async createChannel() {
    const connection = await amqp.connect(rabbitMQ.url);
    this.channel = await connection.createChannel();
  }

  async consumeMsg(routingKey: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.channel) {
        this.createChannel()
          .then(() => {
            this.consumeAndResolve(resolve, routingKey);
          })
          .catch(reject);
      } else {
        this.consumeAndResolve(resolve, routingKey);
      }
    });
  }

  private async consumeAndResolve(
    resolve: (value?: any) => void,
    routingKey: string
  ) {
    const exchangeName = rabbitMQ.exchangeName;
    await this.channel.assertExchange(exchangeName, "direct");
    const q = await this.channel.assertQueue("LogQueue");
    await this.channel.bindQueue(q.queue, exchangeName, routingKey);
    this.channel.consume(q.queue, (msg) => {
      const bufferData: Buffer | undefined = msg?.content;
      const stringData: string | undefined = bufferData?.toString("utf-8");
      const data = JSON.parse(stringData!);
      this.channel.ack(msg!);
      resolve(data);
    });
  }
}

export default Consumer;
