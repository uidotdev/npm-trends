import { ArrowContainer } from 'react-tiny-popover';

import styles from './PopoverContentContainer.module.scss';

const PopoverContentContainer = ({ children, position, childRect, popoverRect }) => {
  const getRotation = () => {
    switch (position) {
      case 'top':
        return '45';
      case 'bottom':
        return '-135';
      case 'left':
        return '-45';
      case 'right':
        return '135';
      default:
        return '-135';
    }
  };

  return (
    <ArrowContainer
      childRect={childRect}
      popoverRect={popoverRect}
      position={position}
      arrowColor="white"
      arrowSize={8}
      arrowStyle={{
        width: '15px',
        height: '15px',
        borderRadius: '0 0 4px 0px',
        background: '#ffffff',
        borderRight: '1px solid #dcdede',
        borderBottom: '1px solid #dcdede',
        borderLeft: 'none',
        borderTop: 'none',
        transform: `rotate(${getRotation()}deg)`,
      }}
    >
      <div className={styles.popover__content}>{children}</div>
    </ArrowContainer>
  );
};

PopoverContentContainer.propTypes = propTypes;

export default PopoverContentContainer;
