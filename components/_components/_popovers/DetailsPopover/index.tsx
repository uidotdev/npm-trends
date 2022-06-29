import { useState } from 'react';
import PropTypes from 'prop-types';
import { Popover } from 'react-tiny-popover';
import { usePackage } from 'services/queries';
import { abbreviateNumber } from 'utils/format';
import Spinner from 'components/_components/Spinner';
import PopoverContentContainer from '../PopoverContentContainer';
import styles from './DetailsPopover.module.scss';

const propTypes = {
  packageName: PropTypes.string,
  children: PropTypes.node,
};

const DetailsPopover = ({ packageName, children }) => {

  const [isOpen, setIsOpen] = useState(false);
  const { data: packageData, isLoading } = usePackage({packageName, isOpen});
  
  const popoverContent = (popoverProps) => (
    <PopoverContentContainer {...popoverProps}>
      {isLoading && (<Spinner />)}
      {packageData && (
        <div className={styles.popover}>
          <div className={styles.popover__name}>{packageData.name}</div>
          <div className={styles.popover__description}>{packageData.description}</div>
          <div className={styles.popover__stats}>
            {packageData.github?.starsCount && (
              <div>
                <i aria-hidden className="icon icon-star-fas" /> {abbreviateNumber(packageData.github?.starsCount)}
              </div>
            )}
            {packageData.downloads && packageData.downloads.weekly > 0 && (
              <div>
                <i aria-hidden className="icon icon-arrow-alt-circle-down" /> {abbreviateNumber(packageData.downloads.weekly)}/wk
              </div>
            )}
          </div>
        </div>
      )}
    </PopoverContentContainer>
  );

  const close = () => {
    setIsOpen(false);
  };

  const content = (
    <span onMouseEnter={() => setIsOpen(true)} onMouseLeave={close}>
      {children}
    </span>
  );

  if (typeof window === 'undefined') {
    return content;
  }

  return (
    <Popover
      containerStyle={{ pointerEvents: 'none' }}
      isOpen={isOpen}
      positions={['bottom']}
      boundaryInset={30}
      padding={10}
      content={popoverContent}
    >
      {content}
    </Popover>
  );
};

DetailsPopover.propTypes = propTypes;

export default DetailsPopover;
