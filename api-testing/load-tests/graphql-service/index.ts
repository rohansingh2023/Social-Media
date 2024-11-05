import http from "k6/http";
import { check } from "k6";

export function testGraphQL() {
  const url = "http://localhost:8081/graphql";

  const queryPosts = `
    query {
      posts {
        id
        title
        content
      }
    }
  `;

  const queryUser = `
    query {
      user(id: "1") {
        id
        name
        email
      }
    }
  `;

  const mutationCreatePost = `
    mutation {
      createPost(input: { title: "New Post", content: "This is the content" }) {
        id
        title
      }
    }
  `;

  const resPosts = http.post(url, JSON.stringify({ query: queryPosts }), {
    headers: { "Content-Type": "application/json" },
  });

  const resUser = http.post(url, JSON.stringify({ query: queryUser }), {
    headers: { "Content-Type": "application/json" },
  });

  const resCreatePost = http.post(
    url,
    JSON.stringify({ query: mutationCreatePost }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  check(resPosts, { "status is 200": (r) => r.status === 200 });
  check(resUser, { "status is 200": (r) => r.status === 200 });
  check(resCreatePost, { "status is 200": (r) => r.status === 200 });
}
