import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Popover from 'react-tiny-popover';

import PopoverContentContainer from '../PopoverContentContainer';

const propTypes = {
  packageName: PropTypes.string,
  children: PropTypes.node,
};

const DetailsPopover = ({ packageName, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const popoverContent = popoverProps => (
    <PopoverContentContainer {...popoverProps}>{packageName}</PopoverContentContainer>
  );

  return (
    <Popover isOpen={isOpen} position="bottom" content={popoverContent}>
      {React.cloneElement(children, {
        onMouseEnter: () => setIsOpen(true),
        onMouseLeave: () => setIsOpen(false),
      })}
    </Popover>
  );
};

DetailsPopover.propTypes = propTypes;

export default DetailsPopover;
