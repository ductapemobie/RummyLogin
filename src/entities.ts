export class Account{
    constructor(
        public accountId:Number,
        public username:String,
        public password:String,
        public gameId:Number
    ){}
}

export class DbAccount{
    constructor(
        public account_id:Number,
        public user_name:String,
        public pass_word:String,
        public g_id:Number
    ){}
}

export class Game{
    constructor(
        public gameId:Number,
        public roomName:String,
        public password:String,
        public players:Number,
        public playerLimit:Number,
        public inSession:Boolean
    ){}
}

//this one needs fixed, not a right now problem
export class DbGame{
    constructor(
        public game_id:Number,
        public room_name:String,
        public pass_word:String
    ){}
}