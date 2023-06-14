import { Button, makeStyles } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { ReactComponent as LoadMoreIcon } from '../../../../assets/images/load_more_arrow.svg';
import Colors from '../../../layout/theme/utils/colors';
import Text from '../../Text';

const useStyles = makeStyles({
  root: {
    'fontSize': 10,
    'color': Colors.navy,
    'fontWeight': 600,
    'letterSpacing': 0.5,
    'textTransform': 'uppercase',
    '&:hover': {
      color: Colors.latest_blue_varient,
      backgroundColor: 'transparent',
    },
  },
});

interface Props {
  onLoadMore: () => void
  className?: string
  disable?: boolean
  label?: string
  id?: string
}

const LoadMoreButton: React.FC<Props> = ({
  onLoadMore,
  className,
  disable = false,
  label = 'common.load.more',
  id = 'boxLoadMore',
}) => {
  const classes = useStyles();

  return (
    <Button
      disableRipple
      variant="text"
      endIcon={<LoadMoreIcon />}
      onClick={onLoadMore}
      className={cx(classes.root, className)}
      disabled={disable}
      id={id}
    >
      <Text message={label} />
    </Button>
  );
};

export default LoadMoreButton;
