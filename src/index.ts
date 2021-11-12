import express, { json } from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

//creating a new user
app.post('/users', (req, res)=>{});

//verifiying a new user
app.get('users/verify', (req, res)=>{});

//logging in
app.patch('users/login', (req, res) =>{});