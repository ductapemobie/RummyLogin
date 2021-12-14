import { Account } from "../entities";
import AccountLogic from "./account-logic";
import AccountDaoImpl from "../daos/account-dao-impl";
import AccountDao from "../daos/account-dao";
import GameDao from "../daos/game-dao";
import GameDaoImpl from "../daos/game-dao-impl";

const accountDao:AccountDao = new AccountDaoImpl();
const gameDao:GameDao = new GameDaoImpl();

export default class AccountLogicImpl implements AccountLogic{
    async createAccount(account: Account): Promise<Account> {
        if (!account.username)throw new Error("Missing Username")
        if (!account.password)throw new Error("Missing Password")
        const usernameTaken = await accountDao.checkUsername(account.username);
        if (usernameTaken) throw new Error("Username already taken")
        else return await accountDao.createAccount(account);
    }
    async getAccountById(accountId: number): Promise<Account> {
        return await accountDao.getAccountById(accountId);
    }
    async getUsers(): Promise<string[]> {
        return (await accountDao.getAccounts()).map(a=>a.username);
    }
    async updatePassword(accountId:number, oldPassword: string, newPassword: string): Promise<Account> {
        const userAccount = await accountDao.getAccountById(accountId);
        if (userAccount.password != oldPassword)throw new Error("Incorrect Password")
        userAccount.password = newPassword;
        return await accountDao.updateAccount(userAccount);
    }
    async deleteAccount(accountId: number, password: string): Promise<boolean> {
        const userAccount = await accountDao.getAccountById(accountId);
        if (userAccount.password != password)throw new Error("Incorrect Password")
        return await accountDao.deleteAccount(accountId);
    }

    async validateLogin(username:string, password:string):Promise<number>{
        let accountId:number = null;
        try{
            accountId = await accountDao.validateLogin(username, password);
        }catch(e){
            throw new Error("Password or Username is Incorrect")
        }
        return accountId;
    }

    //TODO write tests for this one
    //also of note this is gonna get destroyed by race conditions
    //idk how im gonna fix that, for now not a big deal
    async joinGame(accountId: number, gameId: number, password:string): Promise<boolean> {
        let account = null;
        let game = null;
        try{
            account = await accountDao.getAccountById(accountId);
        }catch(error){
            throw new Error("Account does not exist")
        }
        try{
            game = await gameDao.getGameById(gameId);
        }catch(error){
            throw new Error("Game does not exist")
        }
        if (game.inSession){
            throw new Error("Game already in session")
        }
        if (game.players >= game.playerLimit){
            throw new Error("Room full");
        }
        if (password != game.password){
            throw new Error("Incorrect room password")
        }
        const inGamesList = await gameDao.findGamesByPlayer(accountId);
        if (inGamesList.length>0)
            throw new Error("Already in a game")

        game.players = game.players + 1;
        await gameDao.updateGame(game);
        await gameDao.joinGame(gameId, accountId);

        return true;
    }

    async leaveGame(accountId: number): Promise<boolean> {
        let account = null;
        try{
            account = await accountDao.getAccountById(accountId);
        }catch(error){
            throw new Error("Account does not exist")
        }
        const inGamesList = await gameDao.findGamesByPlayer(accountId);
        if (inGamesList.length===0)
            throw new Error("Not in game")
        if (inGamesList.length > 1)
            //will need to throw an error eventually, for now whatever
            console.log('something went wrong')//should update this to a log eventually

        
        const game = await gameDao.getGameById(inGamesList[0]);
        game.players = game.players - 1;

        await gameDao.leaveGame(accountId);
        await gameDao.updateGame(game);

        return true;
    }
}