import {Account, Game} from "../entities"

export default interface GameLogic{
    createGame(game:Game):Promise<Game>;
    getGameById(gameId:Number):Promise<Game>;
    getAllGames():Promise<Array<Game>>;
    updateGame(game:Game):Promise<Game>;
    deleteGame(gameId:Number):Promise<Boolean>;
    getAssocPlayers(gameId:Number):Promise<Array<Account>>;
    startGame(gameId:Number):Promise<Boolean>;
    stopGame(gameId:Number):Promise<Boolean>;
}