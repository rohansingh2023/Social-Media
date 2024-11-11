import {Eureka} from "eureka-js-client"

// Instantiate the Eureka client with configuration
export const eurekaClient = new Eureka({
  instance: {
    app: 'GraphQL-Service',               // Unique name for your service
    instanceId: 'node-service-1',      // Unique ID for this instance
    hostName: 'localhost',             // Hostname or IP of the service
    ipAddr: '127.0.0.1',               // IP address of the service
    statusPageUrl: 'http://localhost:8081/info',  // Status endpoint
    port: {
      '$': 8081,                       // Service port
      '@enabled': true
    },
    vipAddress: 'node-service',        // Virtual address for load balancing
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn'
    }
  },
  eureka: {
    host: 'localhost',                 // Eureka server host
    port: 8761,                        // Eureka server port
    servicePath: '/eureka/apps/'       // Eureka API path
  }
});

