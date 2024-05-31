import { Pool, QueryArrayConfig } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postg1290",
  port: 5432,
});

export default pool;
