export class Account{
    constructor(
        public accountId:Number,
        public username:String,
        public password:String
    ){}
}

export class DbAccount{
    constructor(
        public account_id:Number,
        public user_name:String,
        public pass_word:String
    ){}
}