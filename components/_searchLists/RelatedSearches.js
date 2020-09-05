import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Fetch from 'services/Fetch';
import queryString from 'query-string';

const propTypes = {
  packetsArray: PropTypes.arrayOf(PropTypes.string),
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

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    const { packetsArray } = this.props;

    if (packetsArray !== nextProps.packetsArray) {
      this.fetchRelatedSearches(nextProps.packetsArray);
    }
  };

  fetchRelatedSearches = (packetsArray) => {
    if (!packetsArray.length) {
      this.setState({ searches: [] });
      return;
    }

    const searchQueryParams = queryString.stringify({
      'search_query[]': packetsArray,
    });

    Fetch.getJSON(`/s/related?${searchQueryParams}`).then((data) => {
      const searches = data.map((searchQuery) => searchQuery.slug.split('_').join('-vs-'));
      this.setState({ searches });
    });
  };

  searchesList = () => {
    const { searches } = this.state;

    return searches.map((search) => {
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
          <Link href="/[[...packets]]" as={href}>
            <a title={searchPacketsArray.join(' vs ')}>{packetNames}</a>
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
