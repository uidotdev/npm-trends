import React from 'react';
import PropTypes from 'prop-types';
import MetaTags from 'react-meta-tags';
import { useLocation } from 'react-router-dom';

import shareImage from 'images/npm_trends_share_image.png';

const propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  canonical: PropTypes.string,
};

const defaultProps = {
  title: 'npm trends: Compare NPM package downloads',
  description:
    'Which NPM package should you use? Compare NPM package download stats over time. Spot trends, pick the winner!',
};

const Meta = ({ title, description, canonical }) => {
  const location = useLocation();

  const url = process.env.REACT_APP_FRONTEND_URL + location.pathname;

  return (
    <MetaTags>
      <title>{title}</title>
      <meta name="description" content={description} />

      <link rel="canonical" href={canonical ? process.env.REACT_APP_FRONTEND_URL + canonical : ''} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={shareImage} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={shareImage} />
    </MetaTags>
  );
};

Meta.propTypes = propTypes;

Meta.defaultProps = defaultProps;

export default Meta;
