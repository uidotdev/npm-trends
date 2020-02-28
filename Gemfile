source 'https://rubygems.org'
ruby '2.6.1'

gem 'autoprefixer-rails', '~> 6.5.1'
gem 'bcrypt', '~>3.1.0'
gem 'elasticsearch', '1.1.3'
gem 'faraday_middleware-aws-sigv4', '0.2.4'
gem 'fog', '~> 1.38.0'
gem 'httparty', '~> 0.13.3'
gem 'pg', '~>0.19.0'
gem 'platform-api', '~> 2.1.0'
gem 'puma', '3.12.3'
gem 'rabl', '~> 0.13.1'
gem 'rails', '~>5.2.1'
gem 'react_on_rails', '7.0.4'
gem 'redis', '4.0.2'
gem 'rollbar', '2.14.1'
gem 'sass-rails', '~> 5.0.3'
gem 'sidekiq', '5.2.1'
gem 'sprockets-rails', '~> 3.2.0'
gem 'uglifier', '~> 2.5.1'
gem 'voight_kampff', '1.1.1'
gem 'sitemap_generator', '5.3.1'
gem 'meta-tags', '2.10.0'


group :development, :test do
  gem 'ruby-prof', '~> 0.15.1'
  gem 'derailed_benchmarks'
  gem 'guard-livereload', '2.5.2', require: false
  gem 'rack-livereload', '0.3.16'
  gem 'dotenv-rails', '2.5.0'
end

group :development do
  gem 'web-console', '~> 2.0'
end

group :test do
  gem 'selenium-webdriver', '~> 2.47.1'
  gem 'capybara', '~>2.5.0'
end

group :doc do
  gem 'sdoc', '0.3.20', require: false
end

group :production, :staging, :productionLocal do
  gem 'font_assets'
  gem 'heroku-deflater', '~> 0.6.2'
end


gem 'mini_racer', platforms: :ruby
