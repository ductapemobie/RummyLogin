import { Account } from "../entities";

export default interface AccountDao{
    createAccount(account:Account):Promise<Account>;
    getAccountById(accountId:number):Promise<Account>;
    getAccounts():Promise<Array<Account>>;
    updateAccount(account:Account):Promise<Account>;
    deleteAccount(accountId:number):Promise<boolean>;
    validateLogin(username:string, password:String):Promise<number>;
    checkUsername(username:string):Promise<boolean>;
}