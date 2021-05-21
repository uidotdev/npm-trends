import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import queryString from 'querystring';

import Fetch from 'services/Fetch';
import DetailsPopover from 'components/_components/_popovers/DetailsPopover';

const propTypes = {
  packetNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  packets: PropTypes.arrayOf(PropTypes.object).isRequired,
  colors: PropTypes.arrayOf(PropTypes.array).isRequired,
};

const PackageTags = ({ packetNames = [], packets, colors }) => {
  const [relatedPackets, setRelatedPackets] = useState([]);

  useEffect(() => {
    const fetchRelatedPackets = async () => {
      if (!packetNames.length) return;

      const searchQueryParams = queryString.stringify({
        'search_query[]': packetNames,
      });

      const fetchedRelatedPackets = await Fetch.getJSON(`/s/related_packages?${searchQueryParams}`);

      setRelatedPackets(fetchedRelatedPackets);
    };

    fetchRelatedPackets();
  }, [packetNames]);

  const newUrlAfterRemove = (packetNameToRemove) => {
    const remainingPackets = packetNames.filter((packet) => packet !== packetNameToRemove);
    return `/${remainingPackets.join('-vs-')}`;
  };

  const newUrlAfterAdd = (packetNameToAdd) => `/${packetNames.join('-vs-')}-vs-${packetNameToAdd}`;

  const renderPacketTags = () =>
    packets.map((packet, i) => {
      const border = `2px solid rgb(${colors[i].join(',')})`;
      return (
        <DetailsPopover key={packet.id} packageName={packet.name}>
          <li className="package-search-tag" style={{ border }}>
            <Link href="/[[...packets]]" as={newUrlAfterRemove(packet.name)}>
              <a>
                <span className="search-tag-name">{packet.name}</span>
                <i className="icon icon-cross" aria-hidden />
              </a>
            </Link>
          </li>
        </DetailsPopover>
      );
    });

  const renderRelatedPackets = () => {
    if (!packets.length || !relatedPackets.length) return null;

    if (packetNames.length >= 10) return null;

    return relatedPackets.map((packet, i) => (
      <DetailsPopover key={packet} packageName={packet}>
        <li className="related-package" style={{ marginLeft: i === 0 && '10px' }}>
          <div>
            <Link href="/[[...packets]]" as={newUrlAfterAdd(packet)}>
              <a>
                <i className="icon icon-plus" aria-hidden />
                <span className="related-package--name">{packet}</span>
              </a>
            </Link>
          </div>
        </li>
      </DetailsPopover>
    ));
  };

  return (
    <div className="package-search--tag-container">
      <ul className="package-search-tags list-unstyled">
        {renderPacketTags()}
        {renderRelatedPackets()}
      </ul>
    </div>
  );
};

PackageTags.propTypes = propTypes;

export default PackageTags;
