const koa = require('koa');
const path = require('path');
let app = module.exports = koa();

const config = require('./config');

app.use(function *(){
    this.body = 'Hello World!';
});

if(!module.parent) {
    app.listen(config.port);
    console.log('$ Koa.js start successfully at http://localhost:' + config.port);
}