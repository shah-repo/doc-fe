import React from 'react';
import { translate } from '../../common/intl';
import Config from '../../config';
import { Button } from '../components/forms/fields-next';
import useStyles from './styles';

const NoAccessScreen: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.hero}>
        <img src="/maintenance.svg" alt="No Access" className={classes.image} />
      </div>
      <div className={classes.content}>
        <h1 className={classes.title}>
          {translate('no.access.title')}
        </h1>
        <p className={classes.body}>
          {translate('no.access.body')}
        </p>
      </div>
      <div className={classes.cta}>
        <Button component="a" href={Config.TMUrl}>
          {translate('no.access.return')}
        </Button>
      </div>
    </div>
  );
};

export default NoAccessScreen;
