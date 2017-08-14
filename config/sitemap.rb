# Set the host name for URL creation
SitemapGenerator::Sitemap.default_host = "https://www.npmtrends.com"

# pick a place safe to write the files
SitemapGenerator::Sitemap.public_path = 'tmp/'

# inform the map cross-linking where to find the other maps
SitemapGenerator::Sitemap.sitemaps_host = "http://s3.amazonaws.com/npmtrends/"

# pick a namespace within your bucket to organize your maps
SitemapGenerator::Sitemap.sitemaps_path = 'sitemaps/'

SitemapGenerator::Sitemap.create do

  SearchQuery.find_each do |search_query|
    add search_query.path, :lastmod => search_query.updated_at
  end
  
end
