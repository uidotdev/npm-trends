class Package < ApplicationRecord
	has_many :search_query_packages
	has_many :search_queries, through: :search_query_packages


	# Validations

  validates :name, presence: true


  # Instance methods

  def increment_by_search_type(search_type)
  	if search_type === 'view'
  		self.update_attribute!(:view_count, view_count + 1)
  	else
  		self.update_attributes!(view_count: view_count + 1, search_count: search_count + 1)
  	end
  end

end
