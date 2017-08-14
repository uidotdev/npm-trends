# Set the host name for URL creation
SitemapGenerator::Sitemap.default_host = "https://www.npmtrends.com"

SitemapGenerator::Sitemap.create do

  SearchQuery.find_each do |search_query|
    add search_query.path, :lastmod => search_query.updated_at
  end
  
end
