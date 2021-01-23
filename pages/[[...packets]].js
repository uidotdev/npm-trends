import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import API from 'services/API';
import Package from 'services/Package';
import ToastService from 'services/ToastService';
import { getPacketsParamFromQuery, searchPathToDisplayString, getCanonical } from 'utils/url';

import AppHead from 'components/_templates/AppHead';
import Layout from 'components/_templates/Layout';
import PackageComparison from 'components/PackageComparison';

const propTypes = {
  packets: PropTypes.arrayOf(PropTypes.object),
  // If present, update url (allow FE to handle redirect)
  updateUrlWithPackets: PropTypes.bool,
  packetsWithErrors: PropTypes.arrayOf(PropTypes.string),
};

const Packets = ({ packets, updateUrlWithPackets, packetsWithErrors }) => {
  const { query, push } = useRouter();

  useEffect(() => {
    if (updateUrlWithPackets) {
      const packetsUrlParam = packets.map((p) => p.name).join('-vs-');

      const errorMessage = packetsWithErrors.length
        ? `Error fetching the following packages: ${packetsWithErrors.join(', ')}.`
        : 'Error fetching packages.';

      ToastService.error(errorMessage);

      push(`/${packetsUrlParam}`, undefined);
    } else if (packets.length) {
      const packetsArray = packets.map((p) => p.name);

      API.logSearch(packetsArray, 'view');
    }
  }, [packets, updateUrlWithPackets, packetsWithErrors, push]);

  const queryParamPackets = getPacketsParamFromQuery(query);

  const canonical = queryParamPackets ? getCanonical(queryParamPackets) : undefined;

  let pageTitle = 'npm trends: Compare NPM package downloads';
  let pageDescription =
    'Which NPM package should you use? Compare NPM package download stats over time. Spot trends, pick the winner.';

  if (queryParamPackets.length) {
    const packetsString = searchPathToDisplayString(queryParamPackets);

    pageTitle = `${packetsString} | npm trends`;
    pageDescription = `Compare npm package download statistics over time: ${packetsString}`;
  }

  return (
    <>
      <AppHead title={pageTitle} description={pageDescription} canonical={canonical} />
      <Layout>
        <PackageComparison packets={packets} />
      </Layout>
    </>
  );
};

Packets.propTypes = propTypes;

export async function getServerSideProps({ query }) {
  const queryParamPackets = getPacketsParamFromQuery(query);

  if (!queryParamPackets.length) {
    return { props: { packets: [] } };
  }

  const { validPackages, invalidPackages } = await Package.fetchPackages(queryParamPackets);

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

  // Pass data to the page via props
  return { props: { packets: validPackages } };
}

export default Packets;
