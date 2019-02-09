import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import PackageComparison from '../containers/PackageComparison';
import Header from '../containers/Header';
import Footer from '../containers/Footer';

class AppContainer extends Component {

	static propTypes = {
		match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
	}

	render() {
		return(
			<div className="site-wrapper">
				<Header />
				<div className="content-wrapper">
					<PackageComparison history={this.props.history} params={this.props.match.params} />
				</div>
				<Footer />
			</div>
		);
	}
}

export default AppContainer = withRouter(AppContainer);

