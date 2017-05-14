# Be sure to restart your server when you modify this file.

if Rails.env.production?
	NpmTrends::Application.config.session_store :cookie_store, key: '_npm_trends_session', :domain => 'www.npmtrends.com'
else
	NpmTrends::Application.config.session_store :cookie_store, key: '_npm_trends_session', :domain => :all
end
