'use strict';

var app = require('koa')(),
		logger = require('koa-logger'),
		serve = require('koa-static'),
		router = require('koa-router')(),
		views = require('koa-views'),
		port = process.env.PORT || 3333; 

app.use(serve('public', {defer: true}));
app.use(logger());
app.use(views('public'));

app.use(router.routes());

router.get('/:everything', function *(){
	yield this.render('index');
});

app.listen(port, function(){
	console.log('Node app is running on port', port);
});