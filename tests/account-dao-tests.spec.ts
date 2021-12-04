import { dbClient } from "../src/connection";
import AccountDao from "../src/daos/account-dao";
import AccountDaoImpl from "../src/daos/account-dao-impl";
import { Account } from "../src/entities";

const accountDao:AccountDao = new AccountDaoImpl();
const testId:String = (Math.random() + 1).toString(36).substring(7);
//TODO adapt tests to have unique user ids

test("Create Account", async ()=>{
    let testAccount:Account = new Account(0, testId+'create_test_user', 'create_test_pass');
    testAccount = await accountDao.createAccount(testAccount);
    expect(testAccount.accountId).not.toBe(0);
});

test("Get Account by ID", async ()=>{
    const [testUser, testPass] = [testId+'get_test_user', 'get_test_pass']
    let testAccount:Account = new Account(0, testUser, testPass);
    testAccount = await accountDao.createAccount(testAccount);
    const accountId = testAccount.accountId;
    expect(accountId).not.toBe(0);
    const fetchedAccount = await accountDao.getAccountById(accountId);
    expect(fetchedAccount.username).toBe(testUser)
    expect(fetchedAccount.password).toBe(testPass)
});

test("Get all accounts", async () =>{
    const testAccounts:Array<Account> = [];
    for (let i = 0; i < 3; i ++){
        let tempAccount:Account = new Account(0, testId+'get_all_test_user' + i, 'get_all_test_pass' + i);
        tempAccount = await accountDao.createAccount(tempAccount);
        testAccounts.push(tempAccount);
        expect(testAccounts[i].accountId).not.toBe(0);
    }
    const allAccounts:Array<Account> = await accountDao.getAccounts();
    for (let i = 0; i < 3; i ++){
        expect(testAccounts[i].username).toBe(allAccounts.filter(a=>a.accountId===testAccounts[i].accountId)[0].username)
    }
});

test("Update Account", async ()=>{
    const [testUser, testPass, testPassUpdate] = [testId+'update_test_user', 'update_test_pass', 'update_test_pass_UPDATE']
    let testAccount:Account = new Account(0, testUser, testPass);
    testAccount = await accountDao.createAccount(testAccount);
    const accountId = testAccount.accountId;
    expect(accountId).not.toBe(0);
    testAccount.password = testPassUpdate
    testAccount = await accountDao.updateAccount(testAccount);
    const fetchedAccount = await accountDao.getAccountById(accountId);
    expect(fetchedAccount.password).toBe(testPassUpdate)
});

test("Delete Account", async ()=>{
    const [testUser, testPass] = [testId+'delete_test_user', 'delete_test_pass']
    let testAccount:Account = new Account(0, testUser, testPass);
    testAccount = await accountDao.createAccount(testAccount);
    const accountId = testAccount.accountId;
    expect(accountId).not.toBe(0);
    const deleted = await accountDao.deleteAccount(accountId);
    expect(deleted).toBe(true);
    try{
        await accountDao.getAccountById(accountId)
        expect(1).toBe(0);
    }
    catch(error){
        expect(error.message).toBe("Account does not exist")
    }
})

test("Validate Login", async ()=>{
    const [testUser, testPass, wrongPass] = [testId+'login_test_user', 'login_test_pass', 'wrong_password']
    let testAccount:Account = new Account(0, testUser, testPass);
    testAccount = await accountDao.createAccount(testAccount);
    const accountId = testAccount.accountId;
    expect(accountId).not.toBe(0);
    let e = {message:"No error thrown"};
    try{
        const badLogin = await accountDao.validateLogin(testUser, wrongPass);
    }catch(error){
        e = error;
    }
    expect(e.message).toBe("Invalid Username or Password");
    const goodLogin = await accountDao.validateLogin(testUser, testPass);
    expect(goodLogin).toBe(accountId);
})

test("Check Username", async ()=>{
    let testAccount:Account = new Account(0, testId+'check_test_user', 'check_test_pass');
    let accountCheck:Boolean = await accountDao.checkUsername(testAccount.username);
    expect(accountCheck).toBe(false);
    testAccount = await accountDao.createAccount(testAccount);
    expect(testAccount.accountId).not.toBe(0);
    accountCheck = await accountDao.checkUsername(testAccount.username);
    expect(accountCheck).toBe(true);
})

afterAll(async ()=>{
    dbClient.end();
});