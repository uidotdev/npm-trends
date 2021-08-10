import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import queryString from 'query-string';

import IPackage from 'types/IPackage';
import Fetch from 'services/Fetch';
import DetailsPopover from 'components/_components/_popovers/DetailsPopover';

type Props = {
  packets: IPackage[];
  colors: number[][];
};

const PackageTags = ({ packets, colors }: Props) => {
  const [relatedPackets, setRelatedPackets] = useState([]);

  const packetNamesArray = useMemo(() => packets.map((packet) => packet.name), [packets]);

  useEffect(() => {
    const fetchRelatedPackets = async () => {
      if (!packetNamesArray.length) return;

      const searchQueryParams = queryString.stringify({
        'search_query[]': packetNamesArray,
      });

      const fetchedRelatedPackages: any = await Fetch.getJSON(`/s/related_packages?${searchQueryParams}`);

      setRelatedPackets(fetchedRelatedPackages);
    };

    fetchRelatedPackets();
  }, [packetNamesArray]);

  const newUrlAfterRemove = (packetNameToRemove) => {
    const remainingPackets = packetNamesArray.filter((packet) => packet !== packetNameToRemove);
    return `/${remainingPackets.join('-vs-')}`;
  };

  const newUrlAfterAdd = (packetNameToAdd) => `/${packetNamesArray.join('-vs-')}-vs-${packetNameToAdd}`;

  const renderPackageTags = () =>
    packets.map((packet, i) => {
      const border = `2px solid rgb(${colors[i].join(',')})`;
      return (
        <li key={packet.id} className="package-search-tag" style={{ border }}>
          <DetailsPopover packageName={packet.name}>
            <Link href="/[[...packets]]" as={newUrlAfterRemove(packet.name)}>
              <a>
                <span className="search-tag-name">{packet.name}</span>
                <i className="icon icon-cross" aria-hidden />
              </a>
            </Link>
          </DetailsPopover>
        </li>
      );
    });

  const renderRelatedPackages = () => {
    if (!packets.length || !relatedPackets.length) return null;

    if (packets.length >= 10) return null;

    return relatedPackets.map((packet, i) => (
      <li key={packet} className="related-package" style={{ marginLeft: i === 0 && '10px' }}>
        <div>
          <DetailsPopover packageName={packet}>
            <Link href="/[[...packets]]" as={newUrlAfterAdd(packet)}>
              <a>
                <i className="icon icon-plus" aria-hidden />
                <span className="related-package--name">{packet}</span>
              </a>
            </Link>
          </DetailsPopover>
        </div>
      </li>
    ));
  };

  return (
    <div className="package-search--tag-container">
      <ul className="package-search-tags list-unstyled">
        {renderPackageTags()}
        {renderRelatedPackages()}
      </ul>
    </div>
  );
};

export default PackageTags;
