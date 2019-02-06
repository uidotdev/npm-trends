import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default class PopularSearches extends Component {

	state = {
		searches: []
	}

	componentDidMount = () => {
		this.fetchPopularSearches();
	}

	fetchPopularSearches = () => {
		$.ajax({
			url: '/s/popular',
			dataType: 'json',
			type: 'GET',
			success: function(data){
				const searches = data.map(function(searchQuery){
					return searchQuery.slug.split('_').join('-vs-');
				});
				this.setState({searches: searches})
			}.bind(this),
			error: function(xhr, status, error){
				console.log(xhr);
			}.bind(this)
		});
	}

	handleClick = () => {
		window.scrollTo(0, 0);
	}

	searchesList = () => {
		return this.state.searches.map(function(search, i){
			const base_url = window.location.host;
		  const href = "/" + search;
			const searchPacketsArray = search.split('-vs-');
			const packetNames = searchPacketsArray.map(function(name, i){
				return(
					<span key={i}>
						<span className="text--bold">{name}</span>{ searchPacketsArray.length - 1 !== i && ' vs ' }
					</span>
				);
			});
			return(
				<li key={i}><Link to={href} onClick={this.handleClick} title={searchPacketsArray.join(' vs ')}>{packetNames}</Link></li>
			)
		}, this);
	}

	render() {
		if(!this.state.searches.length) return null;

		return(
			<div className="suggetions--box">
				<h2>Popular</h2>
				<ul className="suggestions-list list-unstyled">
					{this.searchesList()}
				</ul>
			</div>
		)
	}

};
