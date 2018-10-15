require 'elasticsearch'
require 'faraday_middleware/aws_sigv4'

class ElasticsearchService
  def initialize()
  	@client = Elasticsearch::Client.new url: "https://#{ENV['ELASTICSEARCH_URL']}" do |f|
      f.request :aws_sigv4,
                service: 'es',
                region: 'us-east-1',
                access_key_id: ENV['ES_ACCESS_KEY_ID'],
                secret_access_key: ENV['ES_SECRET_ACCESS_KEY']
    end
	end

  def fetchAll(index)
    allResults = []
    r = @client.search index: index, scroll: '5m', size: 10000, body: {sort: ['_doc']}
    allResults.concat(r['hits']['hits'])
    puts "fetched " + r['hits']['hits'].count.to_s
    while r = @client.scroll(scroll_id: r['_scroll_id'], body: { scroll_id: r['_scroll_id'] }, scroll: '5m') and not r['hits']['hits'].empty? do
      puts "fetched " + r['hits']['hits'].count.to_s
      allResults.concat(r['hits']['hits'])
    end

    puts "fetched " + allResults.count.to_s + " total"
    return allResults
  end


end
