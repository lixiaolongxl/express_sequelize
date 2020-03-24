var evn = {
    NODE_ENV: 'online',
    PORT:'8899',
    HOST:'localhost',
    user:'root',
    password:'123456',
    database:'bkdb'
}
for(var item in evn){
    process.env[item]=evn[item];
}

module.exports=evn;