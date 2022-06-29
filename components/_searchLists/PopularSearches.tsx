import { useState, useEffect } from 'react';
import Link from 'next/link';
import Fetch from 'services/Fetch';

const PopularSearches = () => {
  const [searches, setSearches] = useState([]);

  useEffect(() => {
    fetchPopularSearches();
  }, []);

  const fetchPopularSearches = async () => {
    try {
      let fetchedSearches = await Fetch.getJSON('/s/searches?limit=10');
      fetchedSearches = fetchedSearches.map((searchQuery) => searchQuery.slug.split('_').join('-vs-'));

      setSearches(fetchedSearches);
    } catch (e) {
      console.error('Problem fetching popular searches:', e);
    }
  };

  const renderSearchesList = () =>
    searches.map((search) => {
      const href = `/${search}`;
      const searchPacketsArray = search.split('-vs-');
      const packetNames = searchPacketsArray.map((name, i) => (
        <span key={name}>
          <span className="text--bold">{name}</span>
          {searchPacketsArray.length - 1 !== i && ' vs '}
        </span>
      ));
      return (
        <li key={search}>
          <Link href="/[[...packets]]" as={href}>
            <a title={searchPacketsArray.join(' vs ')}>{packetNames}</a>
          </Link>
        </li>
      );
    }, this);

  if (!searches.length) return null;

  return (
    <div className="suggetions--box">
      <h2>Popular Searches</h2>
      <ul className="suggestions-list list-unstyled">{renderSearchesList()}</ul>
    </div>
  );
};

export default PopularSearches;
