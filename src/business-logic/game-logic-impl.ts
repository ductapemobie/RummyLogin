import GameDao from '../daos/game-dao'
import GameDaoImpl from '../daos/game-dao-impl'
import {Account, Game} from '../entities'
import GameLogic from './game-logic'

const gameDao:GameDao = new GameDaoImpl();

export default class GameLogicImpl implements GameLogic{
    async createGame(game: Game): Promise<Game> {
        //dont care if 2 games have the same name, might change later
        return await gameDao.createGame(game);
    }
    async getGameById(gameId: Number): Promise<Game> {
        return await gameDao.getGameById(gameId);
    }
    async getAllGames(): Promise<Game[]> {
        return await gameDao.getGames();
    }
    async updateGame(game: Game, accountId: Number): Promise<Game> {
        throw new Error('Method not implemented.')
    }
    async deleteGame(gameId: Number, accountId: Number): Promise<Boolean> {
        throw new Error('Method not implemented.')
    }
    async getAssocPlayers(gameId: Number): Promise<Account[]> {
        throw new Error('Method not implemented.')
    }
    async startGame(gameId: Number, accountId: Number): Promise<Boolean> {
        throw new Error('Method not implemented.')
    }
    async userStopGame(gameId: Number, accountId: Number): Promise<Boolean> {
        throw new Error('Method not implemented.')
    }

}