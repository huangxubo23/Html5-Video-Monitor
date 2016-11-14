/**
 * Module dependencies.
 */

const koa = require('koa');
const path = require('path');
const logger = require('koa-logger');
const router = require('koa-router')();
const serve = require('koa-static');

let app = module.exports = koa();
// serve files in public folder (css, js, audio, etc)
app.use(serve(__dirname + '/src'));

const config = require('./config');
const render = require('./js/render');

// x-reponse-time
app.use(function* (next) {
    const start = new Date;
    yield next;
    const ms = new Date - start;
    this.set('X-Response-Time', ms + 'ms');
});

// logger middleware
app.use(logger());

// logger
app.use(function* (next) {
    const start = new Date;
    yield next;
    const ms = new Date - start;
    console.log('%s %s - %s', this.method, this.url, ms);
});

router.get('/', home);
router.get('/monitor', monitor);
router.get('/alarm', alarm)

function* home() {
    this.body = 'Hello World!';
}

function* monitor() {
    this.body = yield render('monitor');
}

function* alarm() {
    this.body = yield render('new');
}

// response
// app.use(function* () {
//     this.body = 'Hello World!';
// });

app.use(router.routes())
    .use(router.allowedMethods());

if (!module.parent) {
    app.listen(config.port);
    console.log('$ Koa.js start successfully at http://localhost:' + config.port);
}