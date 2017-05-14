NpmTrends::Application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # In the development environment your application's code is reloaded on
  # every request. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = false

  # LiveReload css into browser
  config.middleware.insert_after Rack::Runtime, Rack::LiveReload

  # Do not eager load code on boot.
  config.eager_load = false

  # Do not serve static assets in development
  config.public_file_server.enabled = false

  # Force all access to the app over SSL, use Strict-Transport-Security, and use secure cookies.
  config.force_ssl = false

  # Fallback to assets pipeline if a precompiled asset is missed.
  config.assets.compile = true

  # Show full error reports and disable caching.
  config.consider_all_requests_local       = true
  config.action_controller.perform_caching = false

  # Don't care if the mailer can't send.
  config.action_mailer.raise_delivery_errors = false

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Raise an error on page load if there are pending migrations
  config.active_record.migration_error = :page_load

  # Debug mode disables concatenation and preprocessing of assets.
  # This option may cause significant delays in view rendering with a large
  # number of complex assets.
  config.assets.debug = true

  # Disable serving static files from the `/public` folder by default since
  # Apache or NGINX already handles this.
  config.public_file_server.enabled = ENV['RAILS_SERVE_STATIC_FILES'].present?

  if ENV["RAILS_LOG_TO_STDOUT"].present?
    logger           = ActiveSupport::Logger.new(STDOUT)
    logger.formatter = config.log_formatter
    config.logger = ActiveSupport::TaggedLogging.new(logger)
  end

  # Development only performance recommendations 
  config.after_initialize do
    Bullet.enable = true
    # Bullet.add_footer = true
    Bullet.bullet_logger = true
    Bullet.rails_logger = true
  end

  ## Configure cache for development
  config.cache_store = :redis_store

  # Active job host
  config.x.active_job.default_url_options = { host: "npmtrends.dev:3000",
                                             protocol:'https' }

  config.action_controller.default_url_options = { host: 'npmtrends.dev:3000',
                                                   protocol:'https'  }   
                                      

end