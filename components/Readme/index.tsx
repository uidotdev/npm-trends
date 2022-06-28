import PropTypes from 'prop-types';
import snarkdown from 'snarkdown';
import sanitizeHtml from 'sanitize-html';

import styles from './Readme.module.scss';

const propTypes = {
  packets: PropTypes.arrayOf(PropTypes.object),
};

const Readme = ({ packets }) => {
  if (!packets || packets.length !== 1) return null;

  const packet = packets[0];

  if (!packet.readme) return null;

  const parsedReadme = snarkdown(packet.readme);
  const sanitizedReadme = sanitizeHtml(parsedReadme, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    disallowedTagsMode: 'discard',
    allowedAttributes: {
      a: ['href', 'name', 'target'],
      img: ['src', 'width', 'height', 'alt'],
    },
    allowedSchemes: sanitizeHtml.defaults.allowedSchemes.filter((scheme) => scheme !== 'http'),
    transformTags: {
      h1: () => ({
        tagName: 'div',
      }),
    },
  });

  return (
    <div className={styles.readme}>
      <h2 className={styles.readme_heading}>Readme</h2>
      <div className={styles.readme_content_container}>
        <article itemProp="text">
          <div
            dangerouslySetInnerHTML={{
              __html: sanitizedReadme,
            }}
          />
        </article>
      </div>
    </div>
  );
};

Readme.propTypes = propTypes;

export default Readme;
