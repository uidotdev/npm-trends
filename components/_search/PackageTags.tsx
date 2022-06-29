import { useCallback, useEffect, useMemo } from 'react';
import Link from 'next/link';
import queryString from 'query-string';
import IPackage from 'types/IPackage';
import DetailsPopover from 'components/_components/_popovers/DetailsPopover';
import { useRelatedPackages } from 'services/queries';
import Spinner from 'components/_components/Spinner';
import { queryClient } from 'pages/_app';
import { Router } from 'next/router';

type Props = {
  packets: IPackage[];
  colors: number[][];
};

const PackageTags = ({ packets, colors }: Props) => {
  const packetNamesArray = useMemo(() => packets.map((packet) => packet.name), [packets]);
  const searchQueryParams = queryString.stringify({
    'search_query[]': packetNamesArray,
  });
  const { data: relatedPackets, isLoading } = useRelatedPackages(searchQueryParams);

  const newUrlAfterRemove = (packetNameToRemove) => {
    const remainingPackets = packetNamesArray.filter((packet) => packet !== packetNameToRemove);
    return `/${remainingPackets.join('-vs-')}`;
  };

  const newUrlAfterAdd = (packetNameToAdd) => `/${packetNamesArray.join('-vs-')}-vs-${packetNameToAdd}`;

  const cancelRelatedPackages = useCallback(() => {
    queryClient.cancelQueries(['related-packages', searchQueryParams]);
  }, [searchQueryParams]);

  useEffect(() => {
    Router.events.on('routeChangeStart', cancelRelatedPackages);
  }, [cancelRelatedPackages]);

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
    if (isLoading)
    return (
      <li className="related-package">
        <div style={{ display: 'inline-flex', flexDirection: 'row', alignItems: 'center', opacity: '.5' }}>
          <Spinner />
          <span>Loading similar packages</span>
        </div>
      </li>
    );

    if (!packets?.length || !relatedPackets?.length) return null;

    return relatedPackets.map((packet, i) => {
      if (i >= 10) return null;
      return (
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
      );
    });
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
