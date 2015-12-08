# NPM Trends
NPM package comparison app


## Getting Started

There are 3 steps to replicate this app in development:

1. Set up this repository

2. Set up the proxy server using [npm-trends-proxy](https://github.com/johnmpotter/npm-trends-proxy)

3. Create an Elasticsearch DB for autocomplete (optional)

### 1. Set up this repository
Make sure you have node.js and npm installed before continuing.

Install npm packages (packages.json):
```
npm install
```

Start server (also performs gulp tasks):
```
npm start
```

server: localhost:3001 (won't work as expected until you set up your proxy server)

note: This app uses LiveReactLoad and Browsersync in development. 
			You should should see changes in the browser automatically 
			after you save a js or css file.

### 2. Set up the proxy server
There are two reasons we use a proxy server: 

1. To enable cors for the registry.npmjs.com request

2. To cache the api responses (helps with response times and api call limits)

Install [redis](http://redis.io/) locally (used as cache store) 

Start you redis server

Clone the repository [npm-trends-proxy](https://github.com/johnmpotter/npm-trends-proxy):
```
git clone https://github.com/johnmpotter/npm-trends-proxy
```

Install npm packages (packages.json):
```
npm install
```

Start server (runs on port 4444 by default):
``` 
npm start
```

The app should now be functioning correctly aside from the autocomplete


### 3. Create an Elasticsearch DB for autocomplete (optional)

This step is optional, but you will not see the autocomplete functionality and it will throw annoying js errors in the web console. Other than that, the app should work as expected without this.

Create an elasticsearch DB locally or remotely. We use [aws elasticsearch](https://aws.amazon.com/elasticsearch-service/) at npmtrends.com. 

Create a file in the root directory named `.env` (we'll be storing our environment variable here)

Set the elasticsearch env variable:
```
# .env
# example: ELASTICSEARCH_URL=npm-elasticsearch-4z0fkk893jms8ukdhfsh5m.us-east-1.es.amazonaws.com

ELASTICSEARCH_URL=your_elasticsearch_url
```

Set up the elasticsearch DB:
```
node elasticsearchSetup.js
```

Load data from npm to the elasticsearch DB (this could take awhile):

We are batch requesting 200,000+ packages from npm, then saving to elasticsearch all packages with over 100 downloads in the last month 
```
node elasticsearch.js
```
note: If it ever gets hung up, you can change the `currentRequest` var in the `elasticsearch.js` file to the number of your last completed request and then run `node elasticsearch.js` again. The process will then start from that most recently completed request.

You should now have a functioning autocomplete backed by your elasticsearch DB. 


## Production

Make sure to set the `NODE_ENV` environment variable to 'production'. 

You can set your production proxy url in the `.env` file:
```
# .env
# example: PROXY_URL=www.myfastproxy.com

PROXY_URL=your_proxy_url
```











