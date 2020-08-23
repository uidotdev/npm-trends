import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  animal: PropTypes.string,
};

const defaultProps = {
  animal: 'Dogs',
};

const FunctionalComponent = ({ animal }) => {
  const adjective = 'awesome';

  return (
    <div>
      {animal} are {adjective}.
    </div>
  );
};

FunctionalComponent.propTypes = propTypes;

FunctionalComponent.defaultProps = defaultProps;

export default FunctionalComponent;
