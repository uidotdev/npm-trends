# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170806181050) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "packages", force: :cascade do |t|
    t.string   "name"
    t.integer  "view_count",   default: 0
    t.integer  "search_count", default: 0
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
    t.index ["name"], name: "index_packages_on_name", unique: true, using: :btree
  end

  create_table "search_queries", force: :cascade do |t|
    t.string   "slug",         limit: 1000
    t.integer  "view_count",                default: 0
    t.integer  "search_count",              default: 0
    t.jsonb    "permutations",              default: []
    t.datetime "created_at",                             null: false
    t.datetime "updated_at",                             null: false
    t.index ["slug"], name: "index_search_queries_on_slug", unique: true, using: :btree
  end

  create_table "search_query_packages", force: :cascade do |t|
    t.integer  "package_id"
    t.integer  "search_query_id"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.index ["package_id"], name: "index_search_query_packages_on_package_id", using: :btree
    t.index ["search_query_id", "package_id"], name: "index_search_query_packages_on_search_query_id_and_package_id", unique: true, using: :btree
    t.index ["search_query_id"], name: "index_search_query_packages_on_search_query_id", using: :btree
  end

  create_table "searches", force: :cascade do |t|
    t.string   "search_permutation", limit: 1000
    t.integer  "search_query_id"
    t.integer  "search_type",                     default: 0
    t.string   "ip_address"
    t.datetime "created_at",                                  null: false
    t.datetime "updated_at",                                  null: false
    t.index ["ip_address"], name: "index_searches_on_ip_address", using: :btree
    t.index ["search_query_id"], name: "index_searches_on_search_query_id", using: :btree
  end

end
