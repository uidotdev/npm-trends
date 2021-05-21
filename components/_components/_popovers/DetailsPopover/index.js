import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Popover } from 'react-tiny-popover';

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
      if (isOpen && !packageData) {
        const result = await Package.fetchPackage(packageName);

        setPackageData(result);
      }
    };

    fetchPackage();
  }, [isOpen, packageName, packageData]);

  const popoverContent = (popoverProps) => (
    <PopoverContentContainer {...popoverProps}>
      {packageData && (
        <div className={styles.popover}>
          <div className={styles.popover__name}>{packageData.name}</div>
          <div className={styles.popover__description}>{packageData.description}</div>
          <div className={styles.popover__stats}>
            {packageData.github && packageData.github.stargazers_count && (
              <div className={styles.popover__stars}>
                <i className="icon icon-star-fas" /> {abbreviateNumber(packageData.github.stargazers_count)}
              </div>
            )}
            {packageData.downloads && packageData.downloads.weekly > 0 && (
              <div className={styles.popover__weekly_downloads}>
                <i className="icon icon-arrow-alt-circle-down" /> {abbreviateNumber(packageData.downloads.weekly)}/wk
              </div>
            )}
          </div>
        </div>
      )}
    </PopoverContentContainer>
  );

  if (typeof window === 'undefined') {
    return children;
  }

  const close = () => {
    setIsOpen(false);
  };

  return (
    <Popover
      containerStyle={{ pointerEvents: 'none' }}
      isOpen={isOpen && packageData}
      position="bottom"
      windowBorderPadding={30}
      content={popoverContent}
    >
      <span onMouseEnter={() => setIsOpen(true)} onMouseLeave={close}>
        {children}
      </span>
    </Popover>
  );
};

DetailsPopover.propTypes = propTypes;

export default DetailsPopover;
