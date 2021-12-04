import { Account } from "../entities";

export default interface AccountDao{
    createAccount(account:Account):Promise<Account>;
    getAccountById(accountId:Number):Promise<Account>;
    getAccounts():Promise<Array<Account>>;
    updateAccount(account:Account):Promise<Account>;
    deleteAccount(accountId:Number):Promise<Boolean>;
    validateLogin(username:String, password:String):Promise<Number>;
    checkUsername(username:String):Promise<Boolean>;
}