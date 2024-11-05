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

export function testSignalingServer() {
  const url = "http://localhost:8000/signal";
  const res = http.post(
    url,
    JSON.stringify({ action: "start", sessionId: "123" }),
    { headers: { "Content-Type": "application/json" } }
  );
  check(res, { "status is 200": (r) => r.status === 200 });
}
