import { ReactNode } from 'react';
import RCTooltip from 'rc-tooltip';

type Props = {
  children: any;
  overlay: ReactNode;
  placement?: string;
};

const Tooltip = ({ children, overlay, placement = 'top', ...rest }: Props) => (
  <RCTooltip
    overlay={overlay}
    placement={placement}
    arrowContent={<div className="rc-tooltip-arrow-inner" />}
    {...rest}
  >
    {children}
  </RCTooltip>
);

export default Tooltip;
