import React from 'react';
import PropTypes from 'prop-types';
import MetaTags from 'react-meta-tags';
import { useRouter } from 'next/router';

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
  const { pathname } = useRouter();

  const url = process.env.NEXT_PUBLIC_FRONTEND_URL + pathname;

  return (
    <MetaTags>
      <title>{title}</title>
      <meta name="description" content={description} />

      <link rel="canonical" href={canonical ? process.env.NEXT_PUBLIC_FRONTEND_URL + canonical : ''} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="images/npm_trends_share_image.png" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="images/npm_trends_share_image.png" />
    </MetaTags>
  );
};

Meta.propTypes = propTypes;

Meta.defaultProps = defaultProps;

export default Meta;
