'use strict';

var app = require('koa')(),
		logger = require('koa-logger'),
		serve = require('koa-static'),
		router = require('koa-router')(),
		views = require('koa-views'),
		port = process.env.PORT || 3333; 

require('dotenv').config({silent: true});

app.use(serve('public', {defer: true}));
app.use(logger());
app.use(views('public', {
	default: 'jade'
}));

// pass env vars to app
app.use(function *(next){
  this.state.env = {
  	node_env: process.env.NODE_ENV,
  	elasticsearch_url: process.env.ELASTICSEARCH_URL,
  	proxy_url: process.env.PROXY_URL
  };
  yield next;
});

app.use(router.routes());

router.get('/', function *(){
	this.state.dog = 'Doggies';
	yield this.render('index');
});

router.get('/:everything', function *(){
	this.state.dog = 'Doggies';
	yield this.render('index');
});

app.listen(port, function(){
	console.log('Node app is running on port', port);
});