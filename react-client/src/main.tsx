import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./utils/router";
import { ApolloProvider } from "@apollo/client";
import { QueryClientProvider, QueryClient } from "react-query";
import client from "./services/apollo-client";

const rqclient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={rqclient}>
      <ApolloProvider client={client}>
        <RouterProvider router={router} />
      </ApolloProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
