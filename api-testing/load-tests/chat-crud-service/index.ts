import http from "k6/http";
import { check } from "k6";

export function testChatCRUD() {
  const baseURL = "http://localhost:9090/";

  // Test GET /chats
  const resGet = http.get(baseURL);
  check(resGet, { "status is 200": (r) => r.status === 200 });

  // Test POST /chats
  const payload = JSON.stringify({ message: "Hello, world!" });
  const resPost = http.post(baseURL, payload, {
    headers: { "Content-Type": "application/json" },
  });
  check(resPost, { "status is 201": (r) => r.status === 201 });

  // Test PUT /chats/{id}
  const chatId = resPost.json("id");
  const resPut = http.put(
    `${baseURL}/${chatId}`,
    JSON.stringify({ message: "Updated message" }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  check(resPut, { "status is 200": (r) => r.status === 200 });

  // Test DELETE /chats/{id}
  const resDelete = http.del(`${baseURL}/${chatId}`);
  check(resDelete, { "status is 204": (r) => r.status === 204 });
}
