class SearchQueryPackage < ApplicationRecord
	belongs_to :search_query
	belongs_to :package

	# Validations
  validates :package_id, presence: true
  validates :search_query_id, presence: true

end