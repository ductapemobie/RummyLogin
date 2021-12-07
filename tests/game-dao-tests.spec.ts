import { dbClient } from "../src/connection";
import GameDao from "../src/daos/game-dao";
import GameDaoImpl from "../src/daos/game-dao-impl";
import { Game } from "../src/entities";

const gameDao:GameDao = new GameDaoImpl();
const testId:String = (Math.random() + 1).toString(36).substring(7);

test("Create Game", async ()=>{
    let testGame:Game = new Game(0, 'hi', 'hi', 0, 0, false);
    testGame = await gameDao.createGame(testGame);
    expect(testGame.gameId).not.toBe(0);
});

afterAll(async ()=>{
    dbClient.end();
});

/*import { dbClient } from "../src/connection";
import GameDao from "../src/daos/game-dao";
import GameDaoImpl from "../src/daos/game-dao-impl";
import { Game } from "../src/entities";

const gameDao:GameDao = new GameDaoImpl();
const testId:String = (Math.random() + 1).toString(36).substring(7);

test("Create Game", async ()=>{
    let testGame:Game = new Game(0, testId+'create_test_game', 'create_test_pass', 0, 2, false);
    testGame = await gameDao.createGame(testGame);
    expect(testGame.gameId).toBe(0);
});

afterAll(async ()=>{
    dbClient.end();
});*/