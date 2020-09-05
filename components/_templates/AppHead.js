import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { useRouter } from 'next/router';

const propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  canonical: PropTypes.string,
};

const AppHead = ({ title, description, canonical }) => {
  const { asPath } = useRouter();

  const rootUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;

  const url = `${rootUrl}${asPath}`;

  return (
    <Head>
      <link rel="canonical" href={canonical ? process.env.NEXT_PUBLIC_FRONTEND_URL + canonical : ''} />

      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

      <title key="title">{title}</title>
      <meta key="decription" name="description" content={description} />

      <meta key="og_title" property="og:title" content={title} />
      <meta key="og_description" property="og:description" content={description} />
      <meta key="og_image" property="og:image" content={`${rootUrl}/images/npm_trends_share_image.png`} />
      <meta key="og_type" property="og:type" content="website" />
      <meta key="og_url" property="og:url" content={url} />

      <meta key="twitter_card" name="twitter:card" content="summary_large_image" />
      <meta key="twitter_title" name="twitter:title" content={title} />
      <meta key="twitter_description" name="twitter:description" content={description} />
      <meta key="twitter_image" name="twitter:image" content={`${rootUrl}/images/npm_trends_share_image.png`} />
    </Head>
  );
};

AppHead.propTypes = propTypes;

export default AppHead;
