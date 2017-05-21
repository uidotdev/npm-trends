### We use Redis-to-go for our jobs que 

if ENV["REDISTOGO_URL"]
	Sidekiq.configure_server do |config|
		config.redis = { url: ENV["REDISTOGO_URL"], 'maxmemory-policy': 'allkeys-lru' }
	end

	Sidekiq.configure_client do |config|
		config.redis = { url: ENV["REDISTOGO_URL"], 'maxmemory-policy': 'allkeys-lru' }
	end
end