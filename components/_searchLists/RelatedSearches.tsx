import { useState, useEffect } from 'react';
import Link from 'next/link';
import Fetch from 'services/Fetch';
import queryString from 'query-string';

type Props = {
  packetNames: string[];
};

const RelatedSearches = ({ packetNames }: Props) => {
  const [searches, setSearches] = useState([]);

  useEffect(() => {
    const fetchRelatedSearches = async () => {
      if (!packetNames.length) {
        setSearches([]);
        return;
      }

      const searchQueryParams = queryString.stringify({
        'search_query[]': packetNames,
      });

      let fetchedSearches = await Fetch.getJSON(`/s/related?${searchQueryParams}`);
      fetchedSearches = fetchedSearches.map((searchQuery) => searchQuery.slug.split('_').join('-vs-'));

      setSearches(fetchedSearches);
    };

    fetchRelatedSearches();
  }, [packetNames]);

  const renderSearchesList = () =>
    searches.map((search) => {
      const href = `/${search}`;
      const searchpacketNames = search.split('-vs-');
      const renderPacketNames = searchpacketNames.map((name, i) => (
        <span key={name}>
          <span className="text--bold">{name}</span>
          {searchpacketNames.length - 1 !== i && ' vs '}
        </span>
      ));
      return (
        <li key={search}>
          <Link href="/[[...packets]]" as={href}>
            <a title={searchpacketNames.join(' vs ')}>{renderPacketNames}</a>
          </Link>
        </li>
      );
    }, this);

  if (!searches.length) return null;

  return (
    <div className="suggetions--box">
      <h2>Related</h2>
      <ul className="suggestions-list list-unstyled">{renderSearchesList()}</ul>
    </div>
  );
};

export default RelatedSearches;
