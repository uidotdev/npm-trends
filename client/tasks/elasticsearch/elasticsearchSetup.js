const esClient = require('./esClient');

esClient.indices.delete({
	index: [
		'xiaomar.php'
	]
});

// Format npm index
esClient.indices.create({
	index: 'npm'
}, function(){
	addMapping();
})

// npm/autocomplete mapping
function addMapping(){
	esClient.indices.putMapping({
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
