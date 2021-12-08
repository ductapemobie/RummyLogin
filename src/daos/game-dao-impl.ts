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
        const sql:String = "select * from game where game_id = $1";
        const values = [gameId];
        const result = await dbClient.query(sql, values);
        const game:Game = result.rows.map(g => new Game(g.game_id, g.room_name, g.pass_word, g.players, g.player_limit, g.inSession))[0];
        if (result.rowCount === 0)throw new Error("Game does not exist")
        return game;
    }

    async getGames(): Promise<Game[]> {
        const sql:String = "select * from game";
        const result = await dbClient.query(sql);
        const games:Array<Game> = result.rows.map(g => new Game(g.game_id, g.room_name, g.pass_word, g.players, g.player_limit, g.inSession));
        return games;
    }
    async updateGame(game: Game): Promise<Game> {
        const sql:String = "update game set (room_name,pass_word,players,player_limit,in_session)=($1,$2,$3,$4,$5) where game_id = $6";
        const values = [game.roomName, game.password, game.players, game.playerLimit, game.inSession, game.gameId];
        const result = await dbClient.query(sql, values);
        if (result.rowCount === 0)throw new Error("Game does not exist")
        game = result.rows.map(g => new Game(g.game_id, g.room_name, g.pass_word, g.players, g.player_limit, g.inSession))[0];
        return game;
    }
    async deleteGame(gameId: Number): Promise<Boolean> {
        const sql:String = "delete from game where game_id = $1";
        const values = [gameId];
        const result = await dbClient.query(sql, values);
        if (result.rowCount === 0)throw new Error("Game does not exist")
        return true;
    }
    
}