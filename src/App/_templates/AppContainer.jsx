import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import PackageComparison from 'App/PackageComparison';
import { searchPathToDisplayString, getCanonical } from 'utils/format';
import Meta from './_components/Meta';
import Header from './Header';
import Footer from './Footer';

const propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

const AppContainer = ({ history, match }) => {
  const searchPath = match.params.packets;

  const title = searchPath ? `${searchPathToDisplayString(searchPath)} | npm trends` : undefined;

  const description = searchPath
    ? `Compare npm package download statistics over time: ${searchPathToDisplayString(searchPath)}`
    : undefined;

  const canonical = searchPath ? getCanonical(searchPath) : null;

  return (
    <div className="site-wrapper">
      <Meta title={title} description={description} canonical={canonical} />
      <Header />
      <div className="content-wrapper">
        <PackageComparison history={history} params={match.params} />
      </div>
      <Footer />
    </div>
  );
};

AppContainer.propTypes = propTypes;

export default withRouter(AppContainer);
