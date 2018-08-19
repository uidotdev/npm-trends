const elasticsearch = require('elasticsearch');
const AWS = require('aws-sdk');

// Load env variables
require('dotenv').config({silent: true});

AWS.config.update({
  credentials: new AWS.Credentials(process.env.ES_ACCESS_KEY_ID, process.env.ES_SECRET_ACCESS_KEY),
  region: 'us-east-1'
});

const esClient = new elasticsearch.Client({
  host: process.env.ELASTICSEARCH_URL,
  connectionClass: require('http-aws-es'),
  apiVersion: '6.3'
});

module.exports = esClient;
