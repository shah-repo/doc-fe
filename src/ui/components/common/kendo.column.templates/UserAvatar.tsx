import { Avatar, Box } from '@material-ui/core';
import { get } from 'lodash';
import React, { lazy, Suspense } from 'react';
import { translate } from '../../../../common/intl';
import useHoverOnce from '../../../hooks/useHoverOnce';
import { getInitalsFromName } from '../../icons/avatar/helpers';
import { CustomGridCellProps } from '../kendo/types';
import { styles } from './UserAvatar.style';

interface AvatarComponentProps {
  name: string
  avatar: string | null
  initialColor?: string
}

const LazyOverflowTooltip = lazy(async () => await import('../../OverflowTooltip'));

export const AvatarComponent: React.FC<AvatarComponentProps> = (props) => {
  const { avatar, name, initialColor } = props;
  const classes = styles();
  const [elementRef, isHovered] = useHoverOnce<HTMLSpanElement>();

  return (
    <Box className={classes.avatar}>
      {avatar && <Avatar className={classes.icon} alt={name} src={avatar} />}
      {!avatar && (
        <Avatar className={classes.icon} style={{ backgroundColor: initialColor }}>
          {getInitalsFromName(name)}
        </Avatar>
      )}
      {!isHovered
        ? <span ref={elementRef}>
          {name ?? '-'}
        </span>
        : <Suspense fallback={<div>{translate('common.loading')}</div>}>
          <LazyOverflowTooltip
            arrow
            placement="top"
            title={name ?? ''}
          >
            {name ?? '-'}
          </LazyOverflowTooltip>
        </Suspense>}
    </Box>
  );
};

export const UserAvatar = ({
  dataItem,
  field,
  colSpan,
  style,
  className,
  columnIndex,
  cellRowClick,
}: CustomGridCellProps) => {
  const userName = get(dataItem, field || '');
  const userDetails = userName ? get(dataItem, field ? field.replace('.name', '') : '') : undefined;
  const owner = userDetails ? userDetails.name : '';
  const avatar = userDetails ? userDetails.avatar : '';
  const initialColor = userDetails ? userDetails.initialColor : '';
  const cellClickEvent = () => {
    if (!cellRowClick) { return; }
    cellRowClick({ dataItem });
  };
  return (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={className}
      data-grid-col-index={columnIndex}
      onClick={cellClickEvent}
    >
      <AvatarComponent name={owner} avatar={avatar} initialColor={initialColor} />
    </td>
  );
};
