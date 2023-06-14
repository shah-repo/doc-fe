import { Typography } from '@material-ui/core';
import React from 'react';
import { convertHtmlEntities } from '../../../../common/utils/helpers';
import { Nullable } from '../../../../state/ducks/common/types';
import { StyleTooltip } from '../../../dashboard.new/line.items/common/StyleTooltip';
import { styles } from './Tooltip.styles';

interface Props {
  data: string | number
  customClass?: string
  childrenElement?: JSX.Element
  placement?: 'bottom' | 'left' | 'right' | 'top' | 'top-start'
  showTooltip?: boolean
  tooltipContent?: Nullable<string>
  className?: string
}

const Tooltip: React.FunctionComponent<Props> = ({
  data,
  customClass,
  childrenElement,
  placement = 'top-start',
  showTooltip = false,
  tooltipContent,
  className,
}) => {
  const classes = styles();
  const renderContent = <span className={className}>
    {!childrenElement && <span  className={customClass}>{data}</span>}
    {childrenElement && childrenElement}
  </span>;
  return (
    showTooltip ? <StyleTooltip
      interactive={true}
      enterDelay={1000}
      title={
        <Typography component="p" className={`${classes.tooltip}`}>
          {tooltipContent ? convertHtmlEntities(tooltipContent.replace(/(<([^>]+)>|\/n)/g, '')) : data}
        </Typography>
      }
      placement={placement}
      arrow
      PopperProps={placement === 'top-start' ? { popperOptions: {} } : {}}
    >
      {renderContent}
    </StyleTooltip> : renderContent
  );
};

export default Tooltip;
