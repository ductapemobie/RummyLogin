import { dbClient } from "../src/connection";
import AccountDao from "../src/daos/accountDAO";
import AccountDaoImpl from "../src/daos/accountDAOImpl";
import { Account } from "../src/entities";

const accountDao:AccountDao = new AccountDaoImpl();

test("Create Account", async ()=>{
    let testAccount:Account = new Account(0, 'test1user', 'test1pass');
    testAccount = await accountDao.createAccount(testAccount);
    expect(testAccount.accountId).not.toBe(0);
});

test("Get Account by ID", async ()=>{
    const [testUser, testPass] = ['test2user', 'test2pass']
    let testAccount:Account = new Account(0, testUser, testPass);
    testAccount = await accountDao.createAccount(testAccount);
    expect(testAccount.accountId).not.toBe(0);
    const accountId = testAccount.accountId;
    const fetchedAccount = await accountDao.getAccountById(accountId);
    expect(fetchedAccount.username).toBe(testUser)
    expect(fetchedAccount.password).toBe(testPass)
});

test("Get all accounts", async () =>{
    const testAccounts:Array<Account> = [];
    for (let i = 0; i < 3; i ++){
        let tempAccount:Account = new Account(0, 'test3user' + i, 'test3pass' + i);
        tempAccount = await accountDao.createAccount(tempAccount);
        testAccounts.push(tempAccount);
        expect(testAccounts[i].accountId).not.toBe(0);
    }
    const allAccounts:Array<Account> = await accountDao.getAccounts();
    for (let i = 0; i < 3; i ++){
        expect(testAccounts[i].username).toBe(allAccounts.filter(a=>a.accountId===testAccounts[i].accountId)[0].username)
    }

});

afterAll(async ()=>{
    dbClient.end();
});