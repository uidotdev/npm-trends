import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Popover from 'react-tiny-popover';

import Package from 'services/Package';
import { abbreviateNumber } from 'utils/format';
import PopoverContentContainer from '../PopoverContentContainer';

import styles from './DetailsPopover.module.scss';

const propTypes = {
  packageName: PropTypes.string,
  children: PropTypes.node,
};

const DetailsPopover = ({ packageName, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [packageData, setPackageData] = useState(null);

  useEffect(() => {
    const fetchPackage = async () => {
      if (isOpen) {
        const result = await Package.fetchPackageDetails(packageName);

        setPackageData(result);
      }
    };

    fetchPackage();
  }, [isOpen, packageName]);

  const popoverContent = (popoverProps) => (
    <PopoverContentContainer {...popoverProps}>
      {packageData && (
        <div className={styles.popover}>
          <div className={styles.popover__name}>{packageData.name}</div>
          <div className={styles.popover__description}>{packageData.description}</div>
        </div>
      )}
    </PopoverContentContainer>
  );

  return (
    <Popover isOpen={isOpen} position="bottom" windowBorderPadding={30} content={popoverContent}>
      <span onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
        {children}
      </span>
    </Popover>
  );
};

DetailsPopover.propTypes = propTypes;

export default DetailsPopover;
