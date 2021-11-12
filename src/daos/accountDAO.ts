import { Account } from "../entities";

export default interface AccountDao{
    createAccount(account:Account):Promise<Account>;
    getAccountById(accountId:Number):Promise<Account>;
    getAccounts():Promise<Array<Account>>;
}