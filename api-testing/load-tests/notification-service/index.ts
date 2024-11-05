import http from "k6/http";
import { check } from "k6";
import { Options } from "k6/options";

export const options: Options = {
  stages: [
    { duration: "30s", target: 100 },
    { duration: "1m", target: 100 },
    { duration: "10s", target: 0 },
  ],
};

export function testNotification() {
  const url = "http://localhost:6005/notifications/:id";
  const res = http.post(url, JSON.stringify({ message: "test message" }), {
    headers: { "Content-Type": "application/json" },
  });
  check(res, { "status is 200": (r) => r.status === 200 });
}
