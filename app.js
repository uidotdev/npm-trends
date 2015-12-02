'use strict';

var app = require('koa')();
var logger = require('koa-logger');
var serve = require('koa-static');
var router = require('koa-router')();
var views = require('koa-views');

app.set('port', (process.env.PORT || 3333));

app.use(serve('public', {defer: true}));
app.use(logger());
app.use(views('public'));

app.use(router.routes());

router.get('/:everything', function *(){
	yield this.render('index');
});

app.listen(app.get('port'), function(){
	console.log('Node app is running on port', app.get('port'));
});