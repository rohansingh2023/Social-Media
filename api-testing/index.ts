import { group } from "k6";
import { testGraphQL } from "./load-tests/graphql-service";
import { testChatCRUD } from "./load-tests/chat-crud-service";
import { testChatSocket } from "./load-tests/chat-socket-service";
import { testNotification } from "./load-tests/notification-service";
import { testSignalingServer } from "./load-tests/signaling-service";

group("Main GraphQL Server Tests", () => {
  testGraphQL();
});

group("Chat CRUD Server Tests", () => {
  testChatCRUD();
});

group("Chat Socket Server Tests", () => {
  testChatSocket();
});

group("Notification Server Tests", () => {
  testNotification();
});

group("Signaling Server Tests", () => {
  testSignalingServer();
});
