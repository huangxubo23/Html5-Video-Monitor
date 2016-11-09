/**
 * Module dependencies.
 */

const koa = require('koa');
const path = require('path');
const logger = require('koa-logger');
let app = module.exports = koa();

const config = require('./config');

// logger middleware
app.use(logger());

app.use(function *(){
    this.body = 'Hello World!';
});

if(!module.parent) {
    app.listen(config.port);
    console.log('$ Koa.js start successfully at http://localhost:' + config.port);
}