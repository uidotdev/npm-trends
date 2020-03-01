import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Fetch from 'services/Fetch';
import queryString from 'query-string';

const propTypes = {
  packetsArray: PropTypes.arrayOf(PropTypes.object),
};

class RelatedSearches extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searches: [],
    };
  }

  componentDidMount = () => {
    const { packetsArray } = this.props;

    if (packetsArray.length) {
      this.fetchRelatedSearches(packetsArray);
    }
  };

  componentWillReceiveProps = nextProps => {
    const { packetsArray } = this.props;

    if (packetsArray !== nextProps.packetsArray) {
      this.fetchRelatedSearches(nextProps.packetsArray);
    }
  };

  fetchRelatedSearches = packetsArray => {
    if (!packetsArray.length) {
      this.setState({ searches: [] });
      return;
    }

    const searchQueryParams = queryString.stringify({
      search_query: packetsArray,
    });

    Fetch.getJSON(`/s/related?${searchQueryParams}`)
      .then(data => {
        const searches = data.map(searchQuery => searchQuery.slug.split('_').join('-vs-'));
        this.setState({ searches });
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleClick = e => {
    // don't scroll if opened in new tab
    if (
      !e.ctrlKey &&
      !e.shiftKey &&
      !e.metaKey && // apple
      !(e.button && e.button === 1) // middle click, >IE9 + everyone else
    ) {
      window.scrollTo(0, 0);
    }
  };

  searchesList = () => {
    const { searches } = this.state;

    searches.map(search => {
      const href = `/${search}`;
      const searchPacketsArray = search.split('-vs-');
      const packetNames = searchPacketsArray.map((name, i) => (
        <span key={name}>
          <span className="text--bold">{name}</span>
          {searchPacketsArray.length - 1 !== i && ' vs '}
        </span>
      ));
      return (
        <li key={search}>
          <Link to={href} onClick={this.handleClick} title={searchPacketsArray.join(' vs ')}>
            {packetNames}
          </Link>
        </li>
      );
    }, this);
  };

  render() {
    const { searches } = this.state;

    if (!searches.length) return null;

    return (
      <div className="suggetions--box">
        <h2>Related</h2>
        <ul className="suggestions-list list-unstyled">{this.searchesList()}</ul>
      </div>
    );
  }
}

RelatedSearches.propTypes = propTypes;

export default RelatedSearches;
