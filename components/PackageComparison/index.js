import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import { colors } from 'utils/colors';
import { getPacketsParamFromQuery } from 'utils/url';

import SearchForm from 'components/_search/SearchForm';
import PackageTags from 'components/_search/PackageTags';
import TrendGraphBox from 'components/_chart/TrendGraphBox';
import PackageStats from 'components/_statsTable/PackageStats';
import PopularSearches from 'components/_searchLists/PopularSearches';
import RelatedSearches from 'components/_searchLists/RelatedSearches';
import PackageComparisonHeading from './_components/PackageComparisonHeading';

const propTypes = {
  packets: PropTypes.arrayOf(PropTypes.object),
};

const PackageComparison = ({ packets }) => {
  const { query, push } = useRouter();

  const queryParamPackets = getPacketsParamFromQuery(query);

  const updateFromSearch = (searchQuery) => {
    let newParam;

    if (queryParamPackets) {
      const packetsArray = queryParamPackets.split('-vs-');
      if (packetsArray.indexOf(searchQuery) < 0) {
        packetsArray.push(searchQuery);
      }
      newParam = packetsArray.join('-vs-');
    } else {
      newParam = searchQuery;
    }

    const url = `/${newParam}`;

    push(url);
  };

  const packetNames = () => (queryParamPackets ? queryParamPackets.split('-vs-') : []);

  return (
    <div className="container">
      <PackageComparisonHeading packetNames={packetNames()} packets={packets} />
      <SearchForm onSearch={updateFromSearch} />
      <PackageTags packets={packets} colors={colors} />
      {packets.length > 0 && (
        <div>
          <TrendGraphBox packets={packets} colors={colors} />
          <PackageStats packets={packets} />
        </div>
      )}
      <div className="suggestions--container">
        <RelatedSearches packetsArray={queryParamPackets ? queryParamPackets.split('-vs-') : []} />
        <PopularSearches />
      </div>
      <div id="extra_info">
        <p>
          If you find any bugs or have a feature request, please open an issue on{' '}
          <a target="_blank" rel="noopener noreferrer" href="http://github.com/johnmpotter/npm-trends">
            github
          </a>
          !
        </p>
        <p>
          The npm package download data comes from {"npm's "}
          <a target="_blank" rel="noopener noreferrer" href="https://github.com/npm/download-counts">
            download counts
          </a>{' '}
          api and package details come from{' '}
          <a target="_blank" rel="noopener noreferrer" href="https://api-docs.npms.io/">
            npms.io
          </a>
          .
        </p>
      </div>
    </div>
  );
};

PackageComparison.propTypes = propTypes;

export default PackageComparison;
