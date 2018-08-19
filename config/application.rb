require File.expand_path('../boot', __FILE__)

# Pick the frameworks you want:
require "active_record/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"
require "sprockets/railtie"
require File.expand_path('../boot', __FILE__)

require "rails/test_unit/railtie"

Bundler.require(:default, Rails.env)

module NpmTrends
  class Application < Rails::Application

    config.assets.paths << Rails.root.join('app', 'assets', 'images')
    config.assets.paths << Rails.root.join('app', 'assets', 'files')
    config.assets.paths << Rails.root.join('app', 'assets', 'fonts')
    config.assets.paths << Rails.root.join('client', 'node_modules')

    config.assets.precompile += %w(*.png *.jpg *.jpeg *.gif)
    config.assets.precompile += %w(.svg .eot .woff .ttf .otf)
    config.exceptions_app = self.routes

    config.assets.quiet = true

  end
end
