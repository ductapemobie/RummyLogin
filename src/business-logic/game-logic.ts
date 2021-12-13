import {Account, Game} from "../entities"

export default interface GameLogic{
    createGame(game:Game):Promise<Game>;
    getGameById(gameId:Number):Promise<Game>;
    getAllGames():Promise<Array<Game>>;
    updateGame(game:Game, accoundId:Number):Promise<Game>;
    deleteGame(gameId:Number, accoundId:Number):Promise<Boolean>;
    getAssocPlayers(gameId:Number):Promise<Array<Account>>;
    startGame(gameId:Number, accoundId:Number):Promise<Boolean>;
    userStopGame(gameId:Number, accoundId:Number):Promise<Boolean>;
}