import { useState } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  packet: PropTypes.object,
};

const PackagephobiaRenderer = ({ packet }) => {
  const [hideSize, setHideSize] = useState(false);

  if (hideSize) return null;

  const sizeUrl = `https://packagephobia.com/result?p=${packet.name}`;
  const badgeUrl = `https://packagephobia.com/badge?p=${packet.name}`;
  return (
    <a href={sizeUrl} target="_blank" rel="noopener noreferrer">
      <img
        width={146}
        height={20}
        onError={() => setHideSize(true)}
        src={badgeUrl}
        alt={`Install size for ${packet.name}, including dependencies`}
        className="badge--in-table"
      />
    </a>
  );
};

PackagephobiaRenderer.propTypes = propTypes;

export default PackagephobiaRenderer;
