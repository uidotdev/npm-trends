import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Popover from 'react-tiny-popover';

import Package from 'services/Package';
import { abbreviateNumber } from 'utils/format';
import PopoverContentContainer from '../PopoverContentContainer';

import './DetailsPopover.css';

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

  const popoverContent = popoverProps => (
    <PopoverContentContainer {...popoverProps}>
      {packageData && (
        <div className="package-details-popover">
          <div className="package-details-popover--name">{packageData.collected.metadata.name}</div>
          <div className="package-details-popover--description">{packageData.collected.metadata.description}</div>
          <div className="package-details-popover--stats">
            {packageData.collected.github && packageData.collected.github.starsCount && (
              <div className="package-details-popover--stars">
                <i className="icon icon-star-fas" /> {abbreviateNumber(packageData.collected.github.starsCount)}
              </div>
            )}
            {packageData.collected.npm && packageData.collected.npm.downloads && (
              <div className="package-details-popover--weekly-downloads">
                <i className="icon icon-arrow-alt-circle-down" />{' '}
                {abbreviateNumber(packageData.collected.npm.downloads[1].count)}/wk
              </div>
            )}
          </div>
        </div>
      )}
    </PopoverContentContainer>
  );

  return (
    <Popover isOpen={isOpen} position="bottom" windowBorderPadding={30} content={popoverContent}>
      {React.cloneElement(children, {
        onMouseEnter: () => setIsOpen(true),
        onMouseLeave: () => setIsOpen(false),
      })}
    </Popover>
  );
};

DetailsPopover.propTypes = propTypes;

export default DetailsPopover;
