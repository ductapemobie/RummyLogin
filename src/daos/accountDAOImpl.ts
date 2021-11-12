import { dbClient } from "../connection";
import { Account, DbAccount } from "../entities";
import AccountDao from "./accountDAO";

export default class AccountDaoImpl implements AccountDao{
    async createAccount(account: Account): Promise<Account> {
        const sql:string = "insert into account (user_name,pass_word) values ($1,$2) returning account_id"
        const values = [account.username, account.password];
        const result = await dbClient.query(sql, values);
        account.accountId = result.rows[0].account_id;
        return account;
    }
    
    async getAccountById(accountId: Number): Promise<Account> {
        const sql:string = "select * from account where account_id=$1"
        const values = [accountId];
        const result = await dbClient.query(sql, values);
        if (result.rowCount === 0){
            throw new Error(`Error: Wedding with id ${accountId} not found`);
        }
        return result.rows.map((a:DbAccount) => new Account(a.account_id, a.user_name, a.pass_word))[0];
    }
    
    async getAccounts(): Promise<Account[]> {
        const sql:string = "select * from account"
        const result = await dbClient.query(sql);
        return result.rows.map((a:DbAccount) => new Account(a.account_id, a.user_name, a.pass_word));
    }
}