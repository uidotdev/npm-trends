class ApplicationController < ActionController::Base

  protect_from_forgery with: :exception
  

  # Technique for serving mobile version taken from: 
  # http://scottwb.com/blog/2012/02/23/a-better-way-to-add-mobile-pages-to-a-rails-site/
  # Can do mobile specific views, but we just use it for the helper method

  def mobile_device?
    if session[:mobile_override].present?
      session[:mobile_override] == "1"
    else
      (request.user_agent =~ /Mobile|webOS/) && (request.user_agent !~ /iPad/) ? true : false
    end
  end

  def tablet_device?
    if session[:tablet_override].present?
      session[:tablet_override] == "1"
    else
      (request.user_agent =~ /iPad/) ? true : false
    end
  end

  helper_method :tablet_device?, :mobile_device?

  # Analytics

  def analytics
    @analytics ||= Analytics.new(current_user, google_analytics_client_id)
  end

  def google_analytics_client_id
    google_analytics_cookie.gsub(/^GA\d\.\d\./, '')
  end

  def google_analytics_cookie
    cookies['_ga'] || ''
  end


end


