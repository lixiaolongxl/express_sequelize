var evn = {
    NODE_ENV: 'test',
    PORT:'8899',
    HOST:'172.0.0.1',
    user:'root',
    password:'152123',
    database:'bxhdb'
}
for(var item in evn){
    process.env[item]=evn[item];
}

module.exports=evn;