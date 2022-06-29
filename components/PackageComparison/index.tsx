import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import { colors } from 'utils/colors';
import { packetNamesToParam } from 'utils/url';

import SearchForm from 'components/_search/SearchForm';
import PackageTags from 'components/_search/PackageTags';
import TrendGraphBox from 'components/_chart/TrendGraphBox';
import PackageStats from 'components/_statsTable/PackageStats';
import PopularSearches from 'components/_searchLists/PopularSearches';
import RelatedSearches from 'components/_searchLists/RelatedSearches';
import EmailSignup from 'components/_templates/EmailSignup';
import Readme from 'components/Readme';
import PackageComparisonHeading from './_components/PackageComparisonHeading';

const propTypes = {
  packets: PropTypes.arrayOf(PropTypes.object),
  packetNames: PropTypes.arrayOf(PropTypes.string),
  subcount: PropTypes.number,
  popularSearches: PropTypes.arrayOf(PropTypes.string),
  packageDownloadData: PropTypes.arrayOf(PropTypes.object),
};

const PackageComparison = ({ packets, packetNames = [], subcount, popularSearches, packageDownloadData }) => {
  const { push } = useRouter();

  const updateFromSearch = useCallback(
    (searchQuery) => {
      let newParam = packetNamesToParam(packetNames);
      if (packetNames.indexOf(searchQuery) < 0) {
        newParam = packetNamesToParam([...packetNames, searchQuery]);
      }
      push(`/${newParam}`);
    },
    [packetNames, push],
  );

  return (
    <div className="container">
      <PackageComparisonHeading packetNames={packetNames} packets={packets} />
      <SearchForm onSearch={updateFromSearch} />
      <PackageTags packets={packets} colors={colors} />
      {packets.length > 0 && (
        <div>
          <TrendGraphBox packageDownloadData={packageDownloadData} packets={packets} colors={colors} />
          <PackageStats packets={packets} />
        </div>
      )}
      <div className="suggestions--container">
        <PopularSearches popularSearches={popularSearches} />
        <RelatedSearches packetNames={packetNames} />
      </div>
      <Readme packets={packets} />
      <EmailSignup subcount={subcount} />
    </div>
  );
};

PackageComparison.propTypes = propTypes;

export default PackageComparison;
