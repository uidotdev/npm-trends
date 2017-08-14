import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default class RelatedSearches extends Component {

	static propTypes = {
		packetsArray: PropTypes.array
	}

	state = {
		searches: []
	}

	componentDidMount = () => {
		if(this.props.packetsArray.length){
			this.fetchRelatedSearches(this.props.packetsArray);
		}
	}

	componentWillReceiveProps = (nextProps) => {
		if(this.props.packetsArray !== nextProps.packetsArray) {
			console.log('called');
			this.fetchRelatedSearches(nextProps.packetsArray);
		}
	}

	fetchRelatedSearches = (packetsArray) => {		
		$.ajax({
			url: '/s/related',
			dataType: 'json',
			type: 'GET',
			data: {
				search_query: packetsArray
			},
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
				<h2>Related</h2>
				<ul className="suggestions-list list-unstyled">
					{this.searchesList()}
				</ul>
			</div>
		)
	}

};