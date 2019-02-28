NpmTrends::Application.routes.draw do

root  'packages#index'

get '/robots.txt' => 'static_pages#robots'
get '/sitemap' => redirect('http://s3.amazonaws.com/npmtrends/sitemaps/sitemap.xml.gz')
get '/sitemap.xml' => redirect('http://s3.amazonaws.com/npmtrends/sitemaps/sitemap.xml.gz')
get '/sitemap.xml.gz' => redirect('http://s3.amazonaws.com/npmtrends/sitemaps/sitemap.xml.gz')

resources :searches, path: '/s', only: [] do
	collection do
		post :log
		get :related
		get :popular
		get :related_packages
	end
end

get "/:id", to: 'packages#index', :constraints => {:id => /.*/}

end
