import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  packetNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  packets: PropTypes.arrayOf(PropTypes.object).isRequired,
};

class PackageComparisonHeading extends Component {
  pageHeading = () => {
    const { packetNames } = this.props;

    if (!packetNames.length) return <span className="text--bold">Compare package download counts over time</span>;
    return packetNames.map(
      (name, i) => (
        <span key={name}>
          <span className="text--bold">{name}</span>
          {packetNames.length - 1 !== i && ' vs '}
        </span>
      ),
      this,
    );
  };

  isSinglePacket = () => {
    const { packets } = this.props;
    return packets.length === 1;
  };

  singlePacketContent = () => {
    const { packets } = this.props;
    const firstPacket = packets[0];
    const { links } = firstPacket.npmsData.collected.metadata;
    return (
      <div className="comparison-heading--subheading">
        <p className="comparison-heading--description">{firstPacket.description}</p>
        <div className="comparison-heading--links">
          <div className="comparison-heading--divider" />
          <a href={links.npm} className="link-icon-npm" target="_blank" rel="noopener noreferrer">
            <i className="icon icon-npm" />
          </a>
          {links.repository && (
            <a href={links.repository} className="link-icon-github" target="_blank" rel="noopener noreferrer">
              <i className="icon icon-github" />
            </a>
          )}
          {links.homepage && (
            <a href={links.homepage} className="link-icon-website" target="_blank" rel="noopener noreferrer">
              <i className="icon icon-link" />
            </a>
          )}
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className="comparison-heading--container">
        <h1 className="comparison-heading--heading">{this.pageHeading()}</h1>
        {this.isSinglePacket() && this.singlePacketContent()}
      </div>
    );
  }
}

PackageComparisonHeading.propTypes = propTypes;

export default PackageComparisonHeading;
