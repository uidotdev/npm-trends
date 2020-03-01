import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import PackageComparison from 'App/_components/PackageComparison';
import Header from './Header';
import Footer from './Footer';

const propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

class AppContainer extends Component {
  render() {
    const { history, match } = this.props;
    return (
      <div className="site-wrapper">
        <Header />
        <div className="content-wrapper">
          <PackageComparison history={history} params={match.params} />
        </div>
        <Footer />
      </div>
    );
  }
}

AppContainer.propTypes = propTypes;

export default withRouter(AppContainer);
