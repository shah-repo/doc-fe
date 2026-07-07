import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import OverflowTooltip from '../../components/OverflowTooltip';
import Text from '../../components/Text';
import { Translation } from '../../translations/types';

const useStyles = makeStyles(() => ({
  breakAll: {
    wordBreak: 'break-all',
  },
}));

interface OwnProps {
  label?: Translation
  value: string | number | JSX.Element
  dataCy?: string
  isSliderView?: boolean
}

export type Props = OwnProps;

export const SummaryInfo: React.FunctionComponent<Props> = ({ label, value, dataCy, isSliderView }) => {
  const classes = useStyles();

  const content = (
    <>
      {label && <Text translation={label} />}
      {label && ': '}
      {value}
    </>
  );

  return (
    <div data-cy={dataCy} className={classes.breakAll}>
      {isSliderView ? (
        <OverflowTooltip title={value} arrow placement="top">
          {content}
        </OverflowTooltip>
      ) : (
        content
      )}
    </div>
  );
};

export default SummaryInfo;
