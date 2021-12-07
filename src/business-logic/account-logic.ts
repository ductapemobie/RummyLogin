import { Account } from "../entities";

export default interface AccountLogic{
    createAccount(account:Account):Promise<Account>;
    getAccountById(accountId:Number):Promise<Account>;
    getUsers():Promise<Array<String>>;//make this one only return usernames
    updatePassword(accoundId:Number, oldPassword:String, newPassword:String):Promise<Account>;
    deleteAccount(accountId:Number, password:String):Promise<Boolean>;
    validateLogin(username:String, password:String):Promise<Number>;
}