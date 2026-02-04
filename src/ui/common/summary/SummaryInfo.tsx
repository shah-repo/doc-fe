import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
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
}

export type Props = OwnProps;

export const SummaryInfo: React.FunctionComponent<Props> = ({
  label, value, dataCy,
}) => {
  const classes = useStyles();
  return (
    <div data-cy={dataCy} className={classes.breakAll}>
      {label
        && <>
          <Text translation={label} />:{' '}
        </>
      }
      {value}
    </div>
  );
};

export default SummaryInfo;
