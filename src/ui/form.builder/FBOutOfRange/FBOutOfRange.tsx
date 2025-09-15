import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { get, isEmpty } from 'lodash';
import { useObserver } from 'mobx-react';
import React from 'react';
import { FB, FBOutOfRangeProps } from '..';
import { translate } from '../../../common/intl';
import useStyles from './FBOutOfRange.styles';

const FBOutOfRange: React.FunctionComponent<FBOutOfRangeProps> = ({
  pass,
  parentName = '',
  path,
}) => {
  const { formState } = FB.useStores();
  const classes = useStyles();

  const isInRange = useObserver(() => {
    const fieldValue = formState?.inputState.get(parentName ?? '')?.value;
    const value = path ? get(fieldValue, path) : fieldValue;
    const isNotDefined = !value || value === '';
    const isInRange = (!pass?.from || value >= pass?.from) && (!pass?.to || value <= pass?.to);
    return isNotDefined || isInRange;
  });

  if (!pass || isEmpty(pass) || isInRange) {
    return null;
  }

  return (
    <div className={classes.root}>
      <FontAwesomeIcon icon={solid('exclamation-circle')} />
      {translate('form.builder.out.of.range')}
    </div>
  );
};

export default FBOutOfRange;
