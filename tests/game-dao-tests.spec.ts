import { dbClient } from "../src/connection";
import AccountDao from "../src/daos/account-dao";
import AccountDaoImpl from "../src/daos/account-dao-impl";
import GameDao from "../src/daos/game-dao";
import GameDaoImpl from "../src/daos/game-dao-impl";
import { Account, Game } from "../src/entities";

const gameDao:GameDao = new GameDaoImpl();
const accountDao:AccountDao = new AccountDaoImpl();
const testId:String = (Math.random() + 1).toString(36).substring(7);

let hostAccount:Account = null;
let accountId = 0;

beforeAll(async ()=>{
    hostAccount = new Account(0, testId+'create_test_user', 'password');
    hostAccount = await accountDao.createAccount(hostAccount);
    accountId = hostAccount.accountId;
});

test("Create Game", async ()=>{
    let testGame:Game = new Game(0, testId+'create_game_test', 'password', 0, 0, false, accountId);
    testGame = await gameDao.createGame(testGame);
    expect(testGame.gameId).not.toBe(0);
});
test("Get game by id", async ()=> {
    let testGame:Game = new Game(0, testId+'get_game_test', 'password', 0, 0, false, accountId);
    testGame = await gameDao.createGame(testGame);
    const gameId = testGame.gameId;
    expect(gameId).not.toBe(0);
    const findGame = await gameDao.getGameById(gameId);
    expect(findGame.roomName).toBe(testGame.roomName);
});

test("Get all games", async () =>{
    const testGames:Array<Game> = [];
    for (let i = 0; i < 3; i ++){
        let tempGame:Game = new Game(0, testId+'get_all_test_user' + i, 'password', 0, 0, false, accountId);
        tempGame = await gameDao.createGame(tempGame);
        testGames.push(tempGame);
        expect(testGames[i].gameId).not.toBe(0);
    }
    const allGames:Array<Game> = await gameDao.getGames();
    for (let i = 0; i < 3; i ++){
        expect(testGames[i].roomName).toBe(allGames.filter(a=>a.gameId===testGames[i].gameId)[0].roomName)
    }
});

test("Update game", async() =>{
    let testGame:Game = new Game(0, testId+'create_game_test', 'password', 0, 0, false, accountId);
    testGame = await gameDao.createGame(testGame);
    expect(testGame.gameId).not.toBe(0);
    testGame.password = 'updated_password'
    await gameDao.updateGame(testGame);
    const updatedGame = await gameDao.getGameById(testGame.gameId);
    expect(updatedGame.password).toBe(testGame.password);
});

test("Delete game", async() =>{
    let testGame:Game = new Game(0, testId+'create_game_test', 'password', 0, 0, false, accountId);
    testGame = await gameDao.createGame(testGame);
    const gameId = testGame.gameId;
    expect(gameId).not.toBe(0);
    await gameDao.deleteGame(gameId);
    try{
        console.error(gameId);
        const deletedGame = await gameDao.getGameById(gameId);
        expect(1).toBe(0);
    }catch(error){
        expect(error.message).toBe("Game does not exist");
    }
})

afterAll(async ()=>{
    dbClient.end();
});

