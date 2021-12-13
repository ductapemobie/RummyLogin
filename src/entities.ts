export class Account{
    constructor(
        public accountId:number,
        public username:string,
        public password:string,
    ){}
}

export class Game{
    constructor(
        public gameId:number,
        public roomName:string,
        public password:string,
        public players:number,
        public playerLimit:number,
        public inSession:boolean,
        public gameOwner:number
    ){}
}