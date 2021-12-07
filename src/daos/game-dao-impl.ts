import { dbClient } from "../connection";
import { Game } from "../entities";
import GameDao from "./game-dao";

export default class GameDaoImpl implements GameDao{
    async createGame(game: Game): Promise<Game> {
        const sql:String = "insert into game (room_name,pass_word,players,player_limit,in_session) values ($1,$2,$3,$4,$5) returning game_id";
        const values = [game.roomName, game.password, 0, game.playerLimit, false];
        const result = await dbClient.query(sql, values);
        game.gameId = result.rows[0].game_id;
        return game;
    }

    async getGameById(gameId: Number): Promise<Game> {
        throw new Error("Method not implemented.");
    }
    async getGames(): Promise<Game[]> {
        throw new Error("Method not implemented.");
    }
    async updateGame(game: Game): Promise<Game> {
        throw new Error("Method not implemented.");
    }
    async deleteGame(gameId: Number): Promise<Boolean> {
        throw new Error("Method not implemented.");
    }
    
}