class SearchesController < ApplicationController

	def log
		if request.bot?
			respond_to do |format|
				format.json { render json: {data: "Not logged because is bot"}, status: 200 }
			end
		end

		search_query_slug = SearchQuery.search_array_to_slug(params[:search_query]) # Ordered alphabetically
		search_permutation = Search.search_array_to_permutation(params[:search_query]) # Unordered
		search_query = SearchQuery.find_or_create_by!(slug: search_query_slug)
		search = Search.new(search_type: params[:search_type], search_permutation: search_permutation, ip_address: request.remote_ip, search_query_id: search_query.id)

		if search.save
			respond_to do |format|
				format.json { render json: {data: "Search data logged"}, status: 200 }
			end
		else
			respond_to do |format|
				format.json { render json: {errors: search.error}, status: 422 }
			end
		end
	rescue ActiveRecord::RecordNotUnique
  	retry
	rescue StandardError => error
		respond_to do |format|
				format.js { render json: {errors: error}, status: 422 }
			end
	end

	def related
		@related_searches = SearchQuery.related_searches_from_search_array(params[:search_query]).limit(5)

		respond_to do |format|
			format.json { render json: @related_searches, status: 200 }
		end
	end

	def popular
		@popular_searches = SearchQuery.popular.limit(5)

		respond_to do |format|
			format.json { render json: @popular_searches, status: 200 }
		end
	end

end