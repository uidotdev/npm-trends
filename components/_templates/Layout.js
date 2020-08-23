import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import ReactGA from 'react-ga';

import PackageComparison from 'components/PackageComparison';
import { searchPathToDisplayString, getCanonical } from 'utils/format';
import Meta from './_components/Meta';
import Header from './Header';
import Footer from './Footer';

ReactGA.initialize(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID);

const propTypes = {
  preview: PropTypes.object,
  children: PropTypes.object.isRequired,
};

const Layout = ({ preview, children }) => {
  const { query, pathname } = useRouter();

  // TODO: track GA somehow
  // ReactGA.pageview(pathname);

  const searchPath = query.packets;

  const title = searchPath ? `${searchPathToDisplayString(searchPath)} | npm trends` : undefined;

  const description = searchPath
    ? `Compare npm package download statistics over time: ${searchPathToDisplayString(searchPath)}`
    : undefined;

  const canonical = searchPath ? getCanonical(searchPath) : null;

  return (
    <div className="site-wrapper">
      <Meta title={title} description={description} canonical={canonical} />
      <Header />
      <div className="content-wrapper">{children}</div>
      <Footer />
    </div>
  );
};

Layout.propTypes = propTypes;

export default Layout;
