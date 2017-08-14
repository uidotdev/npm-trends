class Search < ApplicationRecord
	belongs_to :search_query

	after_create :increment_search_query

	# Did they add a term to the search, remove a term, or simply view the search?
	enum search_type: {
    package_added: 0,
    package_removed: 1,
    view: 2
  }

	# Validations

  validates :search_permutation, presence: true
  validates :search_query_id, presence: true
  validates :search_type, presence: true
  validates :ip_address, presence: true


  # Class methods

  def self.search_array_to_permutation(search_array)
  	# Similar to creating the SearchQuery slug, but without reordering
  	search_array.join('_').downcase
  end


  private

  def increment_search_query
  	search_query.increment_by_search_type(search_type)
  end

end