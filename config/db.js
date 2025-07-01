import pkg from "pg";
const { Client } = pkg;
import dotenv from "dotenv";
dotenv.config({ override: true });

const client = new Client({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
});

const connect = async () => {
  try {
    await client.connect();
    console.log("Connected Successfully...!");
  } catch (error) {
    console.log("Connection error:", error.message);
  }
};
export { client };
export default connect;
