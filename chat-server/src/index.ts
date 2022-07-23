import express from "express";
import { connectToDb } from "./db";
import convRoute from "./routes/conversation";
import messageRoute from "./routes/message";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

connectToDb();

app.use("/api/conversation", convRoute);
app.use("/api/message", messageRoute);

app.listen(3001, () => {
  console.log("Chat Server running at port 3001");
});
