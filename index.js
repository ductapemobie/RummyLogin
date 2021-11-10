import { Datastore } from '@google-cloud/datastore';
import express, { json } from 'express';
import cors from 'cors';

const app = express();
const datastore = new Datastore();

app.use(cors());
app.use(json());


const PORT = process.env.PORT || 1500;

app.listen(PORT, ()=>{
    console.log(`Log In Service Listening on port ${PORT}`);
});

//creating a new user
app.post('/users', (req, res)=>{});

//verifiying a new user
app.get('users/verify', (req, res)=>{});

//logging in
app.patch('users/login', (req, res) =>{});