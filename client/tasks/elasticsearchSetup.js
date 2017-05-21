'use strict';

const elasticsearch = require('elasticsearch');

// Load env variables
require('dotenv').config({silent: true});

var client = new elasticsearch.Client({
  host: process.env.ELASTICSEARCH_URL,
  apiVersion: '1.5'
});

// Format npm index
client.indices.create({
	index: 'npm'
}, function(){
	addMapping();
})

// npm/autocomplete mapping
function addMapping(){
	client.indices.putMapping({
		index: 'npm',
		type: 'autocomplete',
		body: {
			properties:{
				name: {
					type: 'string',
					index: 'analyzed'
				},
				description: {
					type: 'string',
					index: 'no'
				},
				downloads: {
					type: 'integer',
					index: 'no'
				},
				suggest: { 
					"type" : "completion",
	        "index_analyzer" : "simple",
	        "search_analyzer" : "simple",
	        "payloads" : true
	      }
			} 
		}
	});
}