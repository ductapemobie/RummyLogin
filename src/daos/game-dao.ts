import {Game} from "../entities";

export default interface GameDao{
    createGame(game:Game):Promise<Game>;
    getGameById(gameId:Number):Promise<Game>;
    getGames():Promise<Array<Game>>;
    updateGame(game:Game):Promise<Game>;
    deleteGame(gameId:Number):Promise<Boolean>;
}