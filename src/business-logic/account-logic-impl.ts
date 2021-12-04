import { Account } from "../entities";
import AccountLogic from "./account-logic";
import AccountDaoImpl from "../daos/account-dao-impl";
import AccountDao from "../daos/account-dao";

const accountDao:AccountDao = new AccountDaoImpl();

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
    async updatePassword(accountId:Number, password: String): Promise<Account> {
        const userAccount = await accountDao.getAccountById(accountId);
        userAccount.password = password;
        return await accountDao.updateAccount(userAccount);
    }
    async deleteAccount(accountId: Number): Promise<Boolean> {
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
}