import { dbClient } from "../connection";
import { Game, Account } from "../entities";
import AccountDao from "./account-dao";
import AccountDaoImpl from "./account-dao-impl"
import GameDao from "./game-dao";

const accountDao:AccountDao = new AccountDaoImpl();

export default class GameDaoImpl implements GameDao{
    async createGame(game: Game): Promise<Game> {
        const sql:string = "insert into game (room_name,pass_word,players,player_limit,in_session,game_owner) values ($1,$2,$3,$4,$5,$6) returning game_id";
        const values = [game.roomName, game.password, 0, game.playerLimit, false, game.gameOwner];
        const result = await dbClient.query(sql, values);
        game.gameId = result.rows[0].game_id;
        return game;
    }

    async getGameById(gameId: number): Promise<Game> {
        const sql:string = "select * from game where game_id = $1";
        const values = [gameId];
        const result = await dbClient.query(sql, values);
        const game:Game = result.rows.map(g => new Game(g.game_id, g.room_name, g.pass_word, g.players, g.player_limit, g.in_session, g.game_owner))[0];
        if (result.rowCount === 0)throw new Error("Game does not exist")
        return game;
    }

    async getGames(): Promise<Game[]> {
        const sql:string = "select * from game";
        const result = await dbClient.query(sql);
        const games:Array<Game> = result.rows.map(g => new Game(g.game_id, g.room_name, g.pass_word, g.players, g.player_limit, g.inSession, g.game_owner));
        return games;
    }
    async updateGame(game: Game): Promise<Game> {
        const sql:string = "update game set (room_name,pass_word,players,player_limit,in_session,game_owner)=($1,$2,$3,$4,$5,$6) where game_id = $7";
        const values = [game.roomName, game.password, game.players, game.playerLimit, game.inSession, game.gameOwner, game.gameId];
        const result = await dbClient.query(sql, values);
        if (result.rowCount === 0)throw new Error("Game does not exist")
        game = result.rows.map(g => new Game(g.game_id, g.room_name, g.pass_word, g.players, g.player_limit, g.inSession, g.game_owner))[0];
        return game;
    }
    async deleteGame(gameId: number): Promise<boolean> {
        const sql:string = "delete from game where game_id = $1";
        const values = [gameId];
        const result = await dbClient.query(sql, values);
        if (result.rowCount === 0)throw new Error("Game does not exist")
        return true;
    }
    
    async joinGame(gameId: number, accountId: number): Promise<boolean> {
        const sql:string = "insert into game_account_junction (a_id, g_id) values ($1,$2)"
        const values = [accountId, gameId];
        try{
            const result = await dbClient.query(sql, values);
        }catch(error){
            console.log(error);
            return false;
        }
        return true;
    }

    async leaveGame(accountId: number):Promise<boolean>{
        const sql:string = "delete from game_account_junction where a_id = $1";
        const values = [accountId];
        try{
            const result = await dbClient.query(sql, values);
            if (result.rowCount === 0)return false;
        }catch(error){
            console.log(error);
            return false;
        }
        return true;
    }

    async getPlayers(gameId: number):Promise<Array<number>>{
        const sql:string = "select a_id from game_account_junction where g_id = $1"
        const values = [gameId];
        let result = null;
        try{
            result = await dbClient.query(sql, values);
        }catch(error){
            console.log(error)
            throw new Error(error.message)
        }
        return result.rows.map(r=>r.a_id)
    }

    async findGamesByPlayer(accountId: number):Promise<Array<number>>{
        const sql:string = "select g_id from game_account_junction where a_id = $1"
        const values = [accountId];
        let result = null;
        try{
            result = await dbClient.query(sql, values);
        }catch(error){
            console.log(error);
            throw new Error(error.message);
        }
        return result.rows.map(r=>r.g_id);
    }

}