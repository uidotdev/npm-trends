import { useState } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  packet: PropTypes.object,
};

const BundlephobiaRenderer = ({ packet }) => {
  const [hideSize, setHideSize] = useState(false);

  if (hideSize) return null;

  const sizeUrl = `https://bundlephobia.com/result?p=${packet.name}`;
  return (
    <a href={sizeUrl} target="_blank" rel="noopener noreferrer">
      <img
        width={146}
        height={20}
        onError={() => setHideSize(true)}
        src={`https://flat.badgen.net/bundlephobia/minzip/${packet.name}`}
        alt={`Minified + gzip package size for ${packet.name} in KB`}
        className="badge--in-table"
      />
    </a>
  );
};

BundlephobiaRenderer.propTypes = propTypes;

export default BundlephobiaRenderer;
