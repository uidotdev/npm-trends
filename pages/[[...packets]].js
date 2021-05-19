import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

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

  const { validPackages, invalidPackages } = await Package.fetchPackages(packets);

  // https://github.com/vercel/next.js/discussions/11281
  // Currently no way to redirect directly from getServerSideProps
  const manualRedirect = (packagesArray, packetsWithErrors = []) => ({
    props: { packets: packagesArray, updateUrlWithPackets: true, packetsWithErrors },
  });

  const maxPacketsForSearch = 10;

  if (validPackages.length > maxPacketsForSearch) {
    return manualRedirect(validPackages.slice(0, maxPacketsForSearch));
  }

  if (invalidPackages.length) {
    return manualRedirect(validPackages, invalidPackages);
  }

  return { packets: validPackages };
};

const propTypes = {
  initialData: PropTypes.object,
};

const Packets = ({ initialData }) => {
  const [data, setData] = useState(initialData || {});

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
    'Which NPM package should you use? Compare NPM package download stats over time. Spot trends, pick the winner.';

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

Packets.propTypes = propTypes;

const getProps = async (context) => {
  const { query } = context;

  const packetNames = getPacketNamesFromQuery(query);

  const pageData = await fetchPageData(packetNames);

  // If error with any packages, remove errored packages from url
  if (packetNames.length !== pageData.packets.length) {
    const packetsUrlParam = pageData.packets.map((p) => p.name).join('-vs-');

    return {
      redirect: {
        permanent: false,
        destination: `/${packetsUrlParam}`,
      },
    };
  }

  return { props: { initialData: pageData } };
};

export const getServerSideProps = hasNavigationCSR(getProps);

export default Packets;
