import express from 'express';
import dotenv from 'dotenv';
import authcontroller from './Controller/authcontroler.js';
import connect from './db.js';
import authenticate from './middleware/authmiddleware.js';
import orgcontroller from './Controller/orgcontroller.js'
import todocontroler from './Controller/todocontroler.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB Connect
await connect();

// user routes
app.post('/signup', authcontroller.signup);
app.post('/login', authcontroller.login);

// Organization routes
app.post('/org', authenticate, orgcontroller.createorg);
app.get('/myorg', authenticate, orgcontroller.getMyorg);
app.get('/org', authenticate, orgcontroller.getorg);
app.put('/org/:id', authenticate, orgcontroller.updateorg);
app.delete('/org/:id', authenticate, orgcontroller.deleteorg);

// todo routes
app.post('/todo/:orgId', authenticate, todocontroler.createtodo)
app.get('/todo/:orgId', authenticate, todocontroler.gettodo)
app.put("/todo/:id", authenticate, todocontroler.updatetodo);
app.delete("/todo/:id", authenticate, todocontroler.deletetodo);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
