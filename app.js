'use strict';

var app = require('koa')();
var logger = require('koa-logger');
var serve = require('koa-static');
var router = require('koa-router')();
var views = require('koa-views');

app.use(serve('public', {defer: true}));
app.use(logger());
app.use(views('public'));

app.use(router.routes());

router.get('/:everything', function *(){
	yield this.render('index');
});

app.listen(3333);
console.log('Listening on 3333...');