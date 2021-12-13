import {Game} from "../entities";

export default interface GameDao{
    createGame(game:Game):Promise<Game>;
    getGameById(gameId:number):Promise<Game>;
    getGames():Promise<Array<Game>>;
    updateGame(game:Game):Promise<Game>;
    deleteGame(gameId:number):Promise<boolean>;
    getAssocPlayers(gameId:number):Promise<Array<number>>;//returns account id's
}