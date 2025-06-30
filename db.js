import pkg from 'pg'
const { Client } = pkg

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'password',
  database: 'todo',
})

const connect = async () => {
  try {
    await client.connect();
    console.log("Connected Successfully...!");
  } catch (error) {
    console.log("Connection error:", error.message);
  }
};
export { client }
export default connect