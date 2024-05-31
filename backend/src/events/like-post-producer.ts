import { Producer } from "../utils/rabbitmq/producer";
import { LikePostEvent } from "./like-post";
import { Keys } from "../utils/rabbitmq/Keys";

export class LikePostProducer extends Producer<LikePostEvent> {
  key: Keys.PostTopic = Keys.PostTopic;
}
