import express, { Request, Response } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { InMemoryLRUCache } from "@apollo/utils.keyvaluecache";
import { applyMiddleware } from "graphql-middleware";
import { makeExecutableSchema } from "@graphql-tools/schema";
import dotenv from "dotenv";
import cors from "cors";
import cookieSession from "cookie-session";
import Redis from "ioredis";
import { typeDefs } from "./graphql/typedefs";
import resolvers from "./graphql/resolvers";
import { middleware } from "./middlewares";
import dbConnect from "./db";
import models from "./models";
import { morganMiddleware } from "./logging";
import { logger } from "./logging/winston";

dotenv.config();

const app = express();

export const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: 6379,
});

const port = process.env.PORT || 8080;

// app.set("trust proxy", 1);
app.use(morganMiddleware);
app.use(cors({ credentials: true, origin: process.env.ORIGIN_URL }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    signed: false,
  })
);

dbConnect();

const schema = makeExecutableSchema({ typeDefs, resolvers });

const schemaWithMiddleware = applyMiddleware(schema, middleware);

export const startServer = async () => {
  //Create an instance of Apollo Server
  const server: ApolloServer = new ApolloServer({
    schema: schemaWithMiddleware,
    cache: new InMemoryLRUCache({
      maxSize: Math.pow(2, 20) * 100, // ~100MiB
      ttl: 300, // 5 minutes (in seconds)
    }),
  });

  await server.start();

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => ({
        req: req,
        client: redisClient,
        models: models,
      }),
    })
  );

  redisClient.on("connect", () => console.log("Redis Client connected"));
  redisClient.on("error", (err) => console.log("Redis Client Error", err));

  app.get("/", (req: Request, res: Response) => {
    logger.info("Checking the API Status: Everything OK");
    res.json({ data: "api working" });
  });

  app.listen(port, () => {
    logger.info(`🚀 Server ready at at http://localhost:${port}`);
    // console.log(`gql path is ${apolloServer.graphqlPath}`);
  });
};
