import express, { Request, Response } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { InMemoryLRUCache } from "@apollo/utils.keyvaluecache";
import { makeExecutableSchema } from "@graphql-tools/schema";
import dotenv from "dotenv";
import cors from "cors";
import cookieSession from "cookie-session";
import Redis from "ioredis";
import { typeDefs } from "./graphql/typedefs";
import resolvers from "./graphql/resolvers";
import dbConnect from "./db";
import models from "./models";
import { logger } from "./logging";
import { Logger } from "log4u";
import { logRequest } from "./middlewares/log-request";

dotenv.config();

const app = express();

export const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: 6379,
});

const port = process.env.PORT || 8081;

// app.set("trust proxy", 1);
app.use(cors({ credentials: true, origin: process.env.ORIGIN_URL }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    signed: false,
  })
);
app.use(logRequest)

const log4u = new Logger({serviceName: "GRAPHQL"})

dbConnect(log4u);

const schema = makeExecutableSchema({ typeDefs, resolvers });


// const schemaWithMiddleware = applyMiddleware(schema, middleware);

export const startServer = async () => {
  //Create an instance of Apollo Server
  const server: ApolloServer = new ApolloServer({
    schema: schema,
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
        log4u: log4u
      }),
    })
  );

  redisClient.on("connect", () => {
    log4u.log({
      message: "Redis Client connected"
    });
    logger.info("Redis Client connected")});
  redisClient.on("error", (err) => {
    log4u.log({
      type:"ERROR",
      message: "Redis Client Error"
    })
    log4u.log({
      type:"ERROR",
      message: err
    })
    logger.info("Redis Client Error", err)});

  // Start the Eureka client to register the service
  // eurekaClient.start((error) => {
  //   if (error) {
  //     logger.error("Error registering with Eureka", error)
  //   } else {
  //     logger.info("Service registered with Eureka");
  //   }
  // });

  app.get("/", (req: Request, res: Response) => {
    log4u.log({message: "Checking the API Status: Everything OK"})
    res.json({ data: "api working" });
  });

  app.listen(port, () => {
    log4u.log({message: "Starting GraphQL Service"})
    log4u.log({message: `🚀 Server ready at at http://localhost:${port}`})
    logger.http(`🚀 Server ready at at http://localhost:${port}`);
  });
};
