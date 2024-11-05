// load-tests/websocket-test.ts
import { WebSocket } from "k6/experimental/websockets";
import { check } from "k6";
import { Options } from "k6/options";

export const options: Options = {
  stages: [
    { duration: "30s", target: 100 },
    { duration: "1m", target: 100 },
    { duration: "10s", target: 0 },
  ],
};

export function testChatSocket() {
  const url = "ws://localhost:8900";
  const ws = new WebSocket(url);

  ws.onopen = () => {
    console.log("WebSocket connection established");
    ws.send("Hello, server!");
  };

  // ws.onmessage = (event) => {
  //   check(event, { 'message received': (e) => console.log(e?.data)
  //    });
  // };

  ws.onclose = () => {
    console.log("WebSocket connection closed");
  };
}
