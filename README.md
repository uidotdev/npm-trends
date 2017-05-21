# NPM Trends ([npmtrends.com](http://www.npmtrends.com))
NPM package comparison app

## Why?

NPM Trends was initially built in late 2015 when I was just getting into frontend development. Coming from a background in Rails, I was frustrated with how many decisions you had to make early on as a javascript developer. I didn't give an F what my build tool was, I just wanted to get a web app in front of users as quickly as possible. I'm a startup founder first and a web developer second. 

I didn't want to have to worry that 6 months down the road, the framework that I decided to use wouldn't be supported anymore. I wanted a way to see what packages were being used and what way their use was trending. My hypothesis was that you could use the change in download counts over time to predict whether the developer community of a given package or library would be strong for the foreseeable future.

This approach paid off early on when NPM Trends led me to choose Redux over the multitude of other Flux frameworks out at the time. When I looked at the download trends in November of 2015, I saw Redux begining to pull away from the pack. If you look at the stats now, there is no comparison.

![Redux Trend Graph](/app/assets/images/ReduxTrendGraph.png?raw=true)

You shouldn't use an NPM package solely based on the number of downloads the package has, but it should definitely be another data point in your decision making process. Hopefully NPM Trends will help you make better decisions, so you can spend less time jumping from package to package and more time building meaningful applications. 

Cheers! 🍻

## About the code

This app was originally built with a plain React front end and Node.js (Koa) backend ([this commit and earlier](https://github.com/johnmpotter/npm-trends/tree/25792646e9ce9949a9ba07da440e4e188a95e539)). It is now Ruby on Rails with React and Redux (using the awesome [React on Rails gem](https://github.com/shakacode/react_on_rails)). 

This is partly because I have a lot more experince with a Rails backend and partly because the RRRR stack just sounds pretty cool 😎. I appologize for bringing Rails into an app all about Javascript, but ¯\_(ツ)_/¯.


## Getting Started

There are 3 steps to replicate this app in development:

1. Set up this repository

2. Set up the proxy server using [npm-trends-proxy](https://github.com/johnmpotter/npm-trends-proxy)

3. Create an Elasticsearch DB for autocomplete (optional)

### 1. Set up this repository
Make sure you have Ruby 2.2.3, Node.js 5.1.0, NPM 3.3.12, and a [Postgres](https://postgresapp.com/) database installed before continuing.

Install ruby gems (Gemfile):
```
bundle install
```

Install npm packages (packages.json):
```
yarn
```

Prepare the database (first download and run [Postgres App](https://postgresapp.com/)):
```ruby
$ rails db:create
$ rails db:migrate
```

Start server:
```
foreman start -f Procfile.dev
```

note: localhost:5000 (won't work as expected until you set up your proxy server)

optional:

Tail the logs
```
tail -f log/development.log
```

LiveReload (for live css changes)
```
guard
```


### 2. Set up the proxy server
There are two reasons we use a proxy server: 

1. To enable cors for the registry.npmjs.com request

2. To cache the api responses (helps with response times and api call limits)

Install [redis](http://redis.io/) locally (used as cache store) 

Start your redis server
```
redis-server
```

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

Create an elasticsearch DB locally or remotely. (We use [aws elasticsearch](https://aws.amazon.com/elasticsearch-service/) for npmtrends.com.)

Create a file in the root directory named `.env` (we'll be storing our environment variable here)

Set the elasticsearch env variable:
```
# .env
# example: ELASTICSEARCH_URL=npm-elasticsearch-4z0fkk893jms8ukdhfsh5m.us-east-1.es.amazonaws.com

ELASTICSEARCH_URL=your_elasticsearch_url
```

Set up the elasticsearch DB:
```
npm run init-elasticsearch
```

Load data from npm to the elasticsearch DB (this could take awhile):

We are batch requesting 200,000+ packages from npm, then saving to elasticsearch all packages with over 100 downloads in the last month 
```
npm run seed-elasticsearch
```
note: If it ever gets hung up, you can change the `currentRequest` var in the `elasticsearch.js` file to the number of your last completed request and then run `node elasticsearch.js` again. The process will then start from that most recently completed request.

You should now have a functioning autocomplete backed by your elasticsearch DB. 

