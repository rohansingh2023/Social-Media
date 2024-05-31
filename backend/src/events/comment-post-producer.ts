import { Producer } from "../utils/rabbitmq/producer";
import { Keys } from "../utils/rabbitmq/Keys";
import { CommentPostEvent } from "./comment-post";

export class CommentPostProducer extends Producer<CommentPostEvent> {
  key: Keys.PostTopic = Keys.PostTopic;
}
