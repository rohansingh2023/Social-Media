import { Keys } from "src/utils/kafka/Keys";

export interface CommentPostEvent {
  key: Keys.PostTopic;
  data: {
    id: string;
    name: string;
    image: string;
    message: string;
  };
}
