# Social-Media

Built using NextJS, GraphQl, TailwindCSS, Typescript, Socket-Io, Express and MongoDB

- It includes all the latest web technologies ranging from NextJs to GraphQL
- Some of it's features include post, like, comment, friend/unfriend, chat, etc.
- For Real-Time Chat functionality, I've leveraged socket-io's real-time data communication technology.
- Notifications service for sending events receives after like/comment on a post, send/receive friend request.
- Additionally, for having Robust and Typed-safe code, I've used Typescript throughout my application.

## Microservices used:

- `Post and User` : This is in the main Server wriiten in GraphQL (I'm planning to separate post and user services). All of the CRUD in post and user service is done here with the addition of complex functions like send/receive friend requests, like/comment, etc with the Database used is MongoDB.

- `Chat API` : CRUD functions of chatting is done here. The Database used here for storing messages and conversations is MongoDB

- `Chat Socket` : Socket server for Real-Time communication between friends. It makes use of short-polling architecture for deleivering reaL-time messages.

- `Notifications` : CRUD functions for managing notifications. Here, we use RabbitMQ as a message queue for receiving notification messages from other services and delivering it to other services. It uses Push architecture to fill the queue. For storing the notification messages, I've used PostgreSQL as a Relational Database.

- `Client` : This is the frontend of the application. Previously, it was written using NextJS but I've re-written it in ReactJS. The reason was slow routing between pages, not-so backward compatible updates and slow reloads. (NextJS client folder is there on nextjs branch for reference)

## Technologies used:

- `Typescript` : For type-safe Javascript.
- `NodeJS` : Javascript runtime for server-side Javascript.
- `ReactJS` : Javascript library for building single-page applications.
- `NextJS` : ReactJS framework for server-side rendering and static sites for better SEOs.
- `GraphQL` : A query language for building fast and robust APIs with single URL, customized parameter data fetching.
- `MongoDB` : No-SQL Database for storing data as documents.
- `PostgreSQL` : Relational Database for maintaining data as tables.
- `TailwindCSS` : CSS framework for writing CSS inside the JSX.
- `SocketIO` : For Real-Time socket server.
- `RabbitMQ` : For building Message Queue and passing events between services.

## Some of it's previews

- Home Page
  ![Screenshot 2022-09-10 205437](https://user-images.githubusercontent.com/65129632/189497460-2e609828-ef41-4c19-ab24-02bf9a15d586.png)

- Register
  ![Screenshot 2022-09-10 205842](https://user-images.githubusercontent.com/65129632/189497505-009bb9eb-f97b-45fb-84d8-9b31b3fce0a2.png)

- Login
  ![Screenshot 2022-09-10 205825](https://user-images.githubusercontent.com/65129632/189497520-43bbf977-bafc-4bd4-8c5c-ab16b979bcd5.png)

- Search Friends and Users
  ![Screenshot 2022-09-10 205459](https://user-images.githubusercontent.com/65129632/189497529-58b666c6-2dcc-4ee3-851d-7fffec2faec7.png)

- Our Profile Page
  ![Screenshot 2022-09-10 205611](https://user-images.githubusercontent.com/65129632/189497556-c327e9aa-38a9-4596-b6a9-f0453b0fbd56.png)

- Friends's/User's Profile Page
  ![Screenshot 2022-09-10 205636](https://user-images.githubusercontent.com/65129632/189497597-a961527a-4ac9-4c42-88a9-10df253e098d.png)

- Post Page
  ![Screenshot 2022-09-10 205741](https://user-images.githubusercontent.com/65129632/189497608-66b402a3-dec0-4df9-b155-eec6d8817ab1.png)

- Friend Requests
  ![Screenshot 2022-09-10 205540](https://user-images.githubusercontent.com/65129632/189497617-aa41cc7a-a6d4-464e-a5da-b69717c7ffcf.png)

- Chat Page
  ![Screenshot 2022-09-10 205803](https://user-images.githubusercontent.com/65129632/189497623-d3ac0168-8786-462e-bc28-eaca1e709208.png)

## To run the application:

- client : - npm i - npm run dev
- backend: - yarn - yarn dev
- chat-server: - yarn - yarn dev
- socket-server: - yarn - yarn dev
