import AccountDao from '../daos/account-dao';
import AccountDaoImpl from '../daos/account-dao-impl';
import GameDao from '../daos/game-dao'
import GameDaoImpl from '../daos/game-dao-impl'
import {Account, Game, RetGame} from '../entities'
import GameLogic from './game-logic'

const gameDao:GameDao = new GameDaoImpl();
const accountDao:AccountDao = new AccountDaoImpl();

export default class GameLogicImpl implements GameLogic{
    async createGame(game: Game): Promise<Game> {
        //dont care if 2 games have the same name, might change later
        return await gameDao.createGame(game);
    }
    async getGameById(gameId: number): Promise<Game> {
        return await gameDao.getGameById(gameId);
    }
    async getAllGames(): Promise<RetGame[]> {
        //doing this map just so the password doesn't go to the front end
        return (await gameDao.getGames()).map(
            game=>new RetGame(game.gameId, game.roomName, game.players, game.playerLimit, game.inSession, game.gameOwner)
        );
    }
    async deleteGame(gameId: number, accountId: number): Promise<boolean> {
        const game:Game = await gameDao.getGameById(gameId);
        if (game.gameOwner != accountId){
            throw new Error("User does not own this game")
        }
        try{
            await gameDao.deleteGame(gameId);
            return true;
        }catch(error){
            //assuming this to be due to users still being assoc
            return false;
        }
    }
    async hardDeleteGame(gameId: number, accountId: number): Promise<boolean> {
        const game:Game = await gameDao.getGameById(gameId);
        if (game.gameOwner != accountId){
            throw new Error("User does not own this game")
        }
        const players:Array<number> = await gameDao.getPlayers(gameId);
        const playerPromises:Array<Promise<boolean>> = players.map(player => gameDao.leaveGame(player));
        const responses = (await Promise.all(playerPromises)).reduce((a,b)=>a&&b,true);//making sure all come back true
        if(responses){
            const result = await gameDao.deleteGame(gameId);
            return result;
        }else{
            //something went wrong
            throw new Error("Please contact a site admin the database broke")
        }
    }
    async getAssocPlayers(gameId: number): Promise<string[]> {
        const accIds:Array<number> = await gameDao.getPlayers(gameId);
        const promises:Array<Promise<Account>> = accIds.map(account=>accountDao.getAccountById(account));
        const accounts = (await Promise.all(promises)).map(account=>account.username);
        return accounts;
    }

    async startGame(gameId: number, accountId: number): Promise<boolean> {
        const game:Game = await gameDao.getGameById(gameId);
        if (game.gameOwner != accountId){
            throw new Error("User does not own this game")
        }
        if (game.players < 2){
            throw new Error("Cannot start game with 2 players")
        }
        if(game.inSession)return false;//cannot start game already in session
        game.inSession = true;
        await gameDao.updateGame(game);
        return true;
    }
    async userStopGame(gameId: number, accountId: number): Promise<boolean> {
        const game:Game = await gameDao.getGameById(gameId);
        if (game.gameOwner != accountId){
            throw new Error("User does not own this game")
        }
        if(!game.inSession)return false;//cannot stop game not in session
        game.inSession = false;
        await gameDao.updateGame(game);
        return true;
    }

}