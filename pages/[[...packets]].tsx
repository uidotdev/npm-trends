import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';

import IPackage from 'types/IPackage';
import API from 'services/API';
import Package from 'services/Package';
import { getPacketNamesFromQuery, searchPathToDisplayString, getCanonical } from 'utils/url';
import { hasNavigationCSR } from 'utils/hasNavigationCSR';

import AppHead from 'components/_templates/AppHead';
import Layout from 'components/_templates/Layout';
import PackageComparison from 'components/PackageComparison';

const fetchPageData = async (packets) => {
  if (!packets.length) {
    return { packets: [] };
  }

  const { validPackages } = await Package.fetchPackages(packets);

  const maxPacketsForSearch = 10;

  return { packets: validPackages.slice(0, maxPacketsForSearch) };
};

type Props = {
  initialData: {
    packets: IPackage[];
  };
};

export const getServerSideProps = hasNavigationCSR(async ({ query, res }) => {
  const packetNames = getPacketNamesFromQuery(query);
  const pageData = await fetchPageData(packetNames);
  // If error with any packages, remove errored packages from url
  if (pageData.packets && packetNames.length !== pageData.packets.length) {
    const packetsUrlParam = pageData.packets.map((p) => p.name).join('-vs-');

    return {
      redirect: {
        permanent: false,
        destination: `/${packetsUrlParam}`,
      },
    };
  }

  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
  return { props: { initialData: pageData } };
});

const Packets = ({ initialData }: Props) => {
  const [data, setData] = useState(initialData || { packets: [] });
  const { query } = useRouter();
  const { packets } = data;
  const packetNames = useMemo(() => getPacketNamesFromQuery(query), [query]);

  useEffect(() => {
    const fetchData = async () => {
      const pageData = await fetchPageData(packetNames);
      setData(pageData);
    };

    if (!initialData) {
      fetchData();
    }
  }, [initialData, packetNames]);

  useEffect(() => {
    // Log search
    if (packets.length) {
      const packetsArray = packets.map((p) => p.name);

      API.logSearch(packetsArray, 'view');
    }
  }, [packets]);

  const canonical = packetNames ? getCanonical(packetNames) : undefined;
  let pageTitle = 'npm trends: Compare NPM package downloads';
  let pageDescription =
    'Which NPM package should you use? Compare packages download stats, bundle sizes, github stars and more. Spot trends, pick the winner.';

  if (packetNames.length) {
    const packetsString = searchPathToDisplayString(packetNames);

    pageTitle = `${packetsString} | npm trends`;
    pageDescription = `Compare npm package download statistics over time: ${packetsString}`;
  }

  return (
    <>
      <AppHead title={pageTitle} description={pageDescription} canonical={canonical} />
      <Layout>
        <PackageComparison packets={packets} packetNames={packetNames} />
      </Layout>
    </>
  );
};

export default Packets;
