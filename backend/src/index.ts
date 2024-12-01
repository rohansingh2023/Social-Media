import { startServer } from "./app";
import { eurekaClient } from "./config/eureka";
import { logger } from "./logging";

startServer();

// process.on("SIGINT", () => {
//   eurekaClient.stop(() => {
//     logger.info("Service deregistered from Eureka");
//     process.exit(0);
//   });
// });
