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
    async getAccountById(accountId: Number): Promise<Account> {
        return await accountDao.getAccountById(accountId);
    }
    async getUsers(): Promise<String[]> {
        return (await accountDao.getAccounts()).map(a=>a.username);
    }
    async updatePassword(accountId:Number, oldPassword: String, newPassword: String): Promise<Account> {
        const userAccount = await accountDao.getAccountById(accountId);
        if (userAccount.password != oldPassword)throw new Error("Incorrect Password")
        userAccount.password = newPassword;
        return await accountDao.updateAccount(userAccount);
    }
    async deleteAccount(accountId: Number, password: String): Promise<Boolean> {
        const userAccount = await accountDao.getAccountById(accountId);
        if (userAccount.password != password)throw new Error("Incorrect Password")
        return await accountDao.deleteAccount(accountId);
    }

    async validateLogin(username:String, password:String):Promise<Number>{
        let accountId:Number = null;
        try{
            accountId = await accountDao.validateLogin(username, password);
        }catch(e){
            throw new Error("Password or Username is Incorrect")
        }
        return accountId;
    }

    //TODO write tests for this one
    async joinGame(accountId: Number, gameId: Number, password:String): Promise<Boolean> {
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
        if (account.gameId){
            throw new Error("Account is already in a game")
        }
        if (game.players >= game.playerLimit){
            throw new Error("Room full");
        }
        if (password != game.password){
            throw new Error("Incorrect room password")
        }

        account.gameId = game.gameId;
        game.players = game.players + 1;
        await accountDao.updateAccount(account);
        await gameDao.updateGame(game);

        return true;
    }

    async leaveGame(accountId: Number): Promise<Boolean> {
        let account = null;
        let gameId = 0;
        let game = null;
        try{
            account = await accountDao.getAccountById(accountId);
        }catch(error){
            throw new Error("Account does not exist")
        }
        gameId = account.gameId;
        if (!gameId)throw new Error("Account is not in a game")
        try{
            game = await gameDao.getGameById(gameId);
        }catch(error){
            throw new Error("Game does not exist")
        }
        account.gameId = null;
        game.players = game.players - 1;
        await accountDao.updateAccount(account);
        await gameDao.updateGame(game);
        return true;
    }
}