NpmTrends::Application.routes.draw do

root  'packages#index'

resources :searches, path: '/s', only: [] do
	collection do
		post :log
		get :related
		get :popular
	end
end

get "/:id", to: 'packages#index', :constraints => {:id => /.*/}

end