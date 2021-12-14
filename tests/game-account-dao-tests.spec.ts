import { dbClient } from "../src/connection";
import AccountDao from "../src/daos/account-dao";
import AccountDaoImpl from "../src/daos/account-dao-impl";
import GameDao from "../src/daos/game-dao";
import GameDaoImpl from "../src/daos/game-dao-impl";
import { Account, Game } from "../src/entities";

const accountDao:AccountDao = new AccountDaoImpl();
const gameDao:GameDao = new GameDaoImpl();
const testId:String = (Math.random() + 1).toString(36).substring(7);

let hostAccount:Account = null;
let game:Game = null;
let accountId = 0;
let gameId = 0;

beforeAll(async ()=>{
    hostAccount = new Account(0, testId+'create_test_user', 'password');
    hostAccount = await accountDao.createAccount(hostAccount);
    accountId = hostAccount.accountId;
    game = new Game(0, testId+"ag_tests_game", "password", 0, 4, false, accountId);
    game = await gameDao.createGame(game);
    gameId = game.gameId;
});

test("Get game owner", async ()=>{
    //kind of redundant but whatever
    const gottenGame:Game = await gameDao.getGameById(gameId);
    expect(gottenGame.gameOwner).toBe(accountId);
});

test("Join Game", async() =>{
    let testAccount = new Account(0, testId+'join_test_user', 'password');
    testAccount = await accountDao.createAccount(testAccount);
    let testGame:Game = new Game(0, testId+'create_game_test', 'password', 0, 4, false, testAccount.accountId);
    testGame = await gameDao.createGame(testGame);

    let result:boolean = await gameDao.joinGame(gameId, testAccount.accountId);
    expect(result).toBe(true);
    result = await gameDao.leaveGame(testAccount.accountId);
    expect(result).toBe(true);
    result = await gameDao.joinGame(0, testAccount.accountId);
    expect(result).toBe(false);
    result = await gameDao.leaveGame(testAccount.accountId);
    expect(result).toBe(false);
});

test("Players with a game", async() =>{
    let testAccount = new Account(0, testId+'creator', 'password');
    testAccount = await accountDao.createAccount(testAccount);
    let testGame:Game = new Game(0, testId+'create_game_test', 'password', 0, 0, false, testAccount.accountId);
    testGame = await gameDao.createGame(testGame);
    let player1 = new Account(0, testId+'player1', 'password')
    let player2 = new Account(0, testId+'player1', 'password')
    player1 = await accountDao.createAccount(player1);
    player2 = await accountDao.createAccount(player2);
    const p1join = await gameDao.joinGame(testGame.gameId, player1.accountId);
    const p2join = await gameDao.joinGame(testGame.gameId, player2.accountId);
    expect(p1join).toBe(true);
    expect(p2join).toBe(true);
    const players:Array<number> = await gameDao.getPlayers(testGame.gameId);
    expect(players.includes(player1.accountId)).toBe(true);
    expect(players.includes(player2.accountId)).toBe(true);
})

afterAll(async ()=>{
    dbClient.end();
});