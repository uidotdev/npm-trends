# Set the host name for URL creation
SitemapGenerator::Sitemap.default_host = "https://www.npmtrends.com"

# pick a place safe to write the files
SitemapGenerator::Sitemap.public_path = 'tmp/'

# inform the map cross-linking where to find the other maps
SitemapGenerator::Sitemap.sitemaps_host = "http://s3.amazonaws.com/npmtrends/"

# pick a namespace within your bucket to organize your maps
SitemapGenerator::Sitemap.sitemaps_path = 'sitemaps/'

SitemapGenerator::Sitemap.adapter = SitemapGenerator::S3Adapter.new(fog_provider: 'AWS',
                                         aws_access_key_id: ENV["S3_ACCESS_KEY_ID"],
                                         aws_secret_access_key: ENV["S3_SECRET_ACCESS_KEY"],
                                         fog_directory: ENV["DIRECTORY_BUCKET"],
                                         fog_region: ENV["AWS_REGION"])

SitemapGenerator::Sitemap.create do

  elasticsearch = ElasticsearchService.new()

  elasticsearch.fetchAll('npm').in_groups_of(50000).each_with_index do |package_group, i|
    group(:filename => "individual_packages_#{i}", :sitemaps_path => "sitemaps/individual_packages/") do
      package_group.each do |package|
        if package
          add package['_id']
        end
      end
    end
  end


  SearchQuery.find_in_batches(batch_size: 1000).with_index do |query_group, i|
    group(:filename => "search_queries_#{i}", :sitemaps_path => "sitemaps/search_queries/") do
      query_group.each do |search_query|
        add search_query.path, :lastmod => search_query.updated_at
      end
    end
  end

end
