web: bundle exec puma -C config/puma.rb
worker: bundle exec sidekiq -c 1 -v -q default -q mailers
release: rake db:migrate
