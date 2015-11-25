'use strict';

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: "search-npm-registry-4654ri5rsc4mybfyhytyfu225m.us-east-1.es.amazonaws.com",
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