import { dbClient } from "../connection";
import { Account, DbAccount } from "../entities";
import AccountDao from "./account-dao";

export default class AccountDaoImpl implements AccountDao{
    async createAccount(account: Account): Promise<Account> {
        const sql:String = "insert into account (user_name,pass_word) values ($1,$2) returning account_id";
        const values = [account.username, account.password];
        const result = await dbClient.query(sql, values);
        account.accountId = result.rows[0].account_id;
        return account;
    }
    
    async getAccountById(accountId: Number): Promise<Account> {
        const sql:String = "select * from account where account_id=$1";
        const values = [accountId];
        const result = await dbClient.query(sql, values);
        if (result.rowCount === 0){
            throw new Error(`Account does not exist`);
        }
        return result.rows.map((a:DbAccount) => new Account(a.account_id, a.user_name, a.pass_word))[0];
    }
    
    async getAccounts(): Promise<Account[]> {
        const sql:String = "select * from account"
        const result = await dbClient.query(sql);
        return result.rows.map((a:DbAccount) => new Account(a.account_id, a.user_name, a.pass_word));
    }

    async updateAccount(account: Account): Promise<Account> {
        const sql:String = "update account set (user_name,pass_word)=($1,$2) where account_id=$3"
        const values = [account.username, account.password, account.accountId];
        try{
            const result = await dbClient.query(sql, values);
        }catch(e){
            throw new Error("Account does not exist");
        }
        return account;

    }
    async deleteAccount(accountId: Number): Promise<Boolean> {
        const sql:String = "delete from account where account_id=$1";
        const values = [accountId];
        const result = await dbClient.query(sql, values);
        if (result.rowCount === 0){
            throw new Error("Account does not exist")
        }
        return true;
    }
    async validateLogin(username:String, password:String):Promise<Number>{
        const sql:String = 'select account_id from account where (user_name, pass_word) = ($1, $2)';
        const values = [username, password];
        const result = await dbClient.query(sql, values);
        if (result.rowCount === 0){
            throw new Error("Invalid Username or Password");
        }
        return result.rows.map(a=>a.account_id)[0];
    }
    async checkUsername(username:String):Promise<Boolean>{
        const sql:String = 'select account_id from account where user_name = $1';
        const values = [username];
        const result = await dbClient.query(sql, values);
        return (result.rowCount > 0);
    }
}