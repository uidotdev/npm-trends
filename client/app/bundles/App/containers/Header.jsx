import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Header extends Component {

	render() {
		return(
			<header>
				<div className="container">
					<h1 id="site_heading">npm trends</h1>
					<p id="header_subheading">Compare npm package download counts over time</p>
				</div>
			</header>
		);
	}
}