import { Account } from "../entities";

export default interface AccountLogic{
    createAccount(account:Account):Promise<Account>;
    getAccountById(accountId:Number):Promise<Account>;
    getUsers():Promise<Array<String>>;//make this one only return usernames
    updatePassword(accoundId:Number, password:String):Promise<Account>;
    deleteAccount(accountId:Number):Promise<Boolean>;
    validateLogin(username:String, password:String):Promise<Number>;
}