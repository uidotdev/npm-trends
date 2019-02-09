import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Header extends Component {

	render() {
		return(
			<header>
				<div className="container">
					<a href="/" id="site_heading"><img className="site-logo" src="/assets/npm_trends_logo.png"/><span className="site-logo--name">npm trends</span></a>
				</div>
			</header>
		);
	}
}