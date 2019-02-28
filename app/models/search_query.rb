class SearchQuery < ApplicationRecord
	has_many :search_query_packages
	has_many :packages, through: :search_query_packages
	has_many :searches

	before_validation :format_permutations, on: :create

	after_create :build_package_relationships

  scope :popular, -> { order(view_count: :desc) }

	# Validations

  validates :slug, presence: true
  validates :permutations, presence: true


  # Instance methods

  def increment_by_search_type(search_type)
  	if search_type === 'view'
  		self.update_attribute!(:view_count, view_count + 1)
  	else
  		self.update_attributes!(view_count: view_count + 1, search_count: search_count + 1)
  	end

  	packages.each do |package|
  		package.increment_by_search_type(search_type)
  	end
  end

  def path
    '/' + slug.gsub('_', '-vs-')
  end


  # Class methods

  def self.search_array_to_slug(search_array)
  	# Put in alphabetical order, then join packages with '_'
  	# We do this so regardless of the order, it always forms the same slug
  	search_array.sort_by!{ |e| e.downcase }.join('_')
  end

  def self.related_searches_from_search_array(search_array)
    self.joins(:packages).where(packages: { name: search_array }).distinct.where.not(slug: self.search_array_to_slug(search_array)).order(search_count: :desc)
  end

	def self.related_packages_from_search_array(search_array)
		related_searches = self.related_searches_from_search_array(search_array)
		packages = []
    related_searches.each do |search|
			search.packages.each do |package|
				if !search_array.include?(package.name)
					packages.push(package.name)
				end
			end
		end

		packages.uniq
  end

  private

  def format_permutations
  	package_array = slug.split('_')
  	self.permutations = package_array.combination(package_array.length).map do |package_array_permutation|
  		{
  			package_array: package_array_permutation,
  			slug: package_array_permutation.join('_'),
  			search_count: 0
  		}
  	end
  end

  def build_package_relationships
  	package_array = slug.split('_')
  	package_array.each do |package_name|
  		package = Package.find_or_create_by!(name: package_name)
  		self.search_query_packages.create!(package_id: package.id)
  	end
  end

end
