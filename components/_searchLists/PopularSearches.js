import React, { Component } from 'react';
import Link from 'next/link';
import Fetch from 'services/Fetch';

export default class PopularSearches extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searches: [],
    };
  }

  componentDidMount = () => {
    this.fetchPopularSearches();
  };

  fetchPopularSearches = () => {
    Fetch.getJSON('/s/popular').then((data) => {
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
        <h2>Popular</h2>
        <ul className="suggestions-list list-unstyled">{this.searchesList()}</ul>
      </div>
    );
  }
}
