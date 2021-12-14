import {Game} from "../entities";

export default interface GameDao{
    createGame(game:Game):Promise<Game>;
    getGameById(gameId:number):Promise<Game>;
    getGames():Promise<Array<Game>>;
    updateGame(game:Game):Promise<Game>;
    deleteGame(gameId:number):Promise<boolean>;
    joinGame(gameId:number, accountId:number):Promise<boolean>;
    leaveGame(accoundId: number):Promise<boolean>;
    getPlayers(gameId: number):Promise<Array<number>>
    findGamesByPlayer(accountId: number):Promise<Array<number>>
}

