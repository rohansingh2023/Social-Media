import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./utils/router";
import { ApolloProvider } from "@apollo/client";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import client from "./services/apollo-client";
import { Toaster } from "react-hot-toast";
import { SkeletonTheme } from "react-loading-skeleton";
import { OnlineUsersContextProvider } from "./state-management/online-users";

const rqclient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <OnlineUsersContextProvider>
      <QueryClientProvider client={rqclient}>
        <ApolloProvider client={client}>
          <SkeletonTheme baseColor="#202020" highlightColor="#444">
            <Toaster />
            <RouterProvider router={router} />
          </SkeletonTheme>
        </ApolloProvider>
      </QueryClientProvider>
    </OnlineUsersContextProvider>
  </React.StrictMode>
);
