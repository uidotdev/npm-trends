class CreatePackages < ActiveRecord::Migration[5.0]
  def change
    create_table :packages do |t|
      t.string :name
      t.integer :view_count, default: 0
      t.integer :search_count, default: 0

      t.timestamps
    end

    add_index "packages", [:name], unique: true, using: :btree

    create_table :search_query_packages do |t|
      t.integer :package_id
      t.integer :search_query_id

      t.timestamps
    end

    add_index "search_query_packages", [:search_query_id], using: :btree
    add_index "search_query_packages", [:package_id], using: :btree
    add_index "search_query_packages", [:search_query_id, :package_id], unique: true, using: :btree

    create_table :search_queries do |t|
      t.string :slug, limit: 1000
      t.integer :view_count, default: 0
      t.integer :search_count, default: 0
      t.jsonb :permutations, default: []

      t.timestamps
    end

    add_index "search_queries", [:slug], unique: true, using: :btree

    create_table :searches do |t|
      t.string :search_permutation, limit: 1000
      t.integer :search_query_id
      t.integer :search_type, default: 0
      t.string :ip_address

      t.timestamps
    end

    add_index "searches", [:search_query_id], using: :btree
    add_index "searches", [:ip_address], using: :btree

  end
end
