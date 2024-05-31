import { Keys } from "src/utils/kafka/Keys";

export interface LikePostEvent {
  key: Keys.PostTopic;
  data: {
    id: string;
    name: string;
    image: string;
    message: string;
  };
}
