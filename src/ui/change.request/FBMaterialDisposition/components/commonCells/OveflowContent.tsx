import { Box } from '@material-ui/core';
import React, { lazy, Suspense } from 'react';
import { translate } from '../../../../../common/intl';
import useHoverOnce from '../../../../hooks/useHoverOnce';
import useStyles from './OverflowingContent.styles';

interface Props {
  title?: React.ReactNode
  onClick?: () => void
}

const LazyOverflowTooltip = lazy(async () => await import('../../../../components/OverflowTooltip'));

const OverflowingContent: React.FC<Props> = ({ title, children, onClick }) => {
  const classes = useStyles();
  const [elementRef, isHoveredOnce] = useHoverOnce<HTMLDivElement>();

  return (
    <Box onClick={onClick}>
      {!isHoveredOnce
        ? <div ref={elementRef} className={classes.wrapper}>
          { children }
        </div>
        : <Suspense fallback={<div>{translate('common.loading')}</div>}>
          <LazyOverflowTooltip
            title={title ?? children}
            placement="top"
            interactive
            arrow
          >
            {children}
          </LazyOverflowTooltip>
        </Suspense>}
    </Box>
  );
};

export default OverflowingContent;
