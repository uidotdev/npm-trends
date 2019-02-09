import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Footer extends Component {

	render() {
		return(
			<footer>
				<div className="container">
					<div className="footer-content">
						<ul id="footer_menu" className="list-unstyled">
							<li className="inline">Made by <a target="_blank" href="http://twitter.com/johnmpotter">John Potter</a></li>
						</ul>
					</div>
				</div>
			</footer>
		);
	}
}
