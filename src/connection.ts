import { Client } from 'pg';

export const dbClient:Client = new Client({
    user:'postgres',
    password:'fKb6Fjw2xa8nFiuw',
    database:'users',
    port:5432,
    host:'34.133.10.102'
});

dbClient.connect();
