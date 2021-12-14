import express, { json } from 'express';
import cors from 'cors';
import { Account, RetGame } from './entities';
import AccountLogic from './business-logic/account-logic';
import AccountLogicImpl from './business-logic/account-logic-impl';
import jwt from 'jsonwebtoken'
import GameLogic from './business-logic/game-logic';
import GameLogicImpl from './business-logic/game-logic-impl';

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY || 'placeholder-secret'
const accountLogic:AccountLogic = new AccountLogicImpl();
const gameLogic:GameLogic = new GameLogicImpl();

app.post('/users', async (req, res)=>{
    const body  = req.body;
    const username = body.username;
    const password = body.password;
    try{
        let account = new Account(0, username , password);
        account = await accountLogic.createAccount(account);
        res.status(201)
        res.send()
    }catch(error){
        res.status(403)
        res.send(error.message)
    }
});

app.patch('/users/login', async (req, res) =>{
    const body  = req.body;
    const username = body.username;
    const password = body.password;
    try{
        let result = await accountLogic.validateLogin(username, password);
        const token = jwt.sign({accountId:result}, SECRET_KEY)
        res.status(200);
        res.send(token)
    }
    catch(error){
        res.status(403)
        res.send(error.message);
    }
});

app.patch('/users/updatepassword', async (req, res) => {
    const token:any = req.headers.jwt;
    let accountId:Number = 0;
    const oldPassword:String = req.body.oldPassword;
    const newPassword:String = req.body.newPassword;
    try{
        const result:any = jwt.verify(token, SECRET_KEY);
        accountId = result.accountId;
    }catch(error){
        res.status(401);
        res.send(error.message)
    }
    try{
        const updatedAccount = await accountLogic.updatePassword(accountId, oldPassword, newPassword);
        res.status(200);
        res.send("Password updated successfully")
    }catch(error){
        res.status(403);
        res.send(error.message);
    }
})

app.patch('/users/delete', async (req, res) =>{
    const token:any = req.headers.jwt;
    let accountId:Number = 0;
    const password:String = req.body.password;
    try{
        const result:any = jwt.verify(token, SECRET_KEY);   
        accountId = result.accountId;
    }catch(error){
        res.status(403);
        res.send(error.message)
    }
    try{
        const deleted:Boolean = await accountLogic.deleteAccount(accountId, password);
        res.status(200)
        res.send(`Account ${accountId} deleted successfully`);
    }catch(error){
        res.status(403);
        res.send(error.message)
    }
});

app.get('/users/token', async (req, res) => {
    const token:any = req.headers.jwt;
    try{
        const result:any = jwt.verify(token, SECRET_KEY);
        const accountId:Number = result.accountId;
        const userAccount = await accountLogic.getAccountById(accountId);
        const retAccount = {
            accountId:userAccount.accountId,
            username:userAccount.username
        };//dont want to send password to front end
        res.status(200)
        res.send(retAccount);
    }catch(error){
        res.status(403);
        res.send(error.message)
    }
});

app.get('/games', async (req, res)=>{
    const games:Array<RetGame> = await gameLogic.getAllGames();
    return games;
})

app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`)
})