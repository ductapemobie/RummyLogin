import {Account, Game} from "../entities"

export default interface GameLogic{
    createGame(game:Game):Promise<Game>;
    getGameById(gameId:Number):Promise<Game>;
    getAllGames():Promise<Array<Game>>;
    deleteGame(gameId:Number, accoundId:Number):Promise<Boolean>;
    hardDeleteGame(gameId:Number, accoundId:Number):Promise<Boolean>;
    getAssocPlayers(gameId:Number):Promise<Array<string>>;
    startGame(gameId:Number, accoundId:Number):Promise<Boolean>;
    userStopGame(gameId:Number, accoundId:Number):Promise<Boolean>;
}