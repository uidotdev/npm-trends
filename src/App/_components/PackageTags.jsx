import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Fetch from 'services/Fetch';
import queryString from 'query-string';

const propTypes = {
  packets: PropTypes.arrayOf(PropTypes.object).isRequired,
  colors: PropTypes.arrayOf(PropTypes.array).isRequired,
};

class PackageTags extends Component {
  constructor(props) {
    super(props);
    this.state = {
      relatedPackets: [],
    };
  }

  componentDidMount = () => {
    const { packets } = this.props;

    if (packets.length) {
      this.fetchRelatedPackets();
    }
  };

  componentDidUpdate = prevProps => {
    const { packets } = this.props;

    if (packets !== prevProps.packets) {
      this.fetchRelatedPackets();
    }
  };

  packetNamesArray = () => {
    const { packets } = this.props;

    return packets.map(packet => packet.name);
  };

  fetchRelatedPackets = () => {
    const { packets } = this.props;
    if (!packets.length) return;

    const searchQueryParams = queryString.stringify({
      search_query: this.packetNamesArray(),
    });

    Fetch.getJSON(`/s/related_packages?${searchQueryParams}`).then(data => {
      this.setState({ relatedPackets: data });
    });
  };

  newUrlAfterRemove = packetNameToRemove => {
    const remainingPackets = this.packetNamesArray().filter(packet => packet !== packetNameToRemove);
    return `/${remainingPackets.join('-vs-')}`;
  };

  newUrlAfterAdd = packetNameToAdd => `/${this.packetNamesArray().join('-vs-')}-vs-${packetNameToAdd}`;

  packetTags = () => {
    const { packets, colors } = this.props;

    return packets.map((packet, i) => {
      const border = `2px solid rgb(${colors[i].join(',')})`;
      return (
        <li key={packet.id} className="package-search-tag" style={{ border }}>
          <Link to={this.newUrlAfterRemove(packet.name)}>
            <span className="search-tag-name">{packet.name}</span>
            <i className="icon icon-cross" />
          </Link>
        </li>
      );
    });
  };

  relatedPackets = () => {
    const { packets } = this.props;
    const { relatedPackets } = this.state;

    if (packets.length >= 10) return null;

    return relatedPackets.map((packet, i) => (
      <li key={packet} className="related-package" style={{ marginLeft: i === 0 && '10px' }}>
        <div>
          <Link to={this.newUrlAfterAdd(packet)}>
            <i className="icon icon-plus" />
            <span className="related-package--name">{packet}</span>
          </Link>
        </div>
      </li>
    ));
  };

  render() {
    return (
      <div className="package-search--tag-container">
        <ul className="package-search-tags list-unstyled">
          {this.packetTags()}
          {this.relatedPackets()}
        </ul>
      </div>
    );
  }
}

PackageTags.propTypes = propTypes;

export default PackageTags;
