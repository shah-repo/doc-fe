import { Button } from '@material-ui/core';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Text from '../../../components/Text';
import useStyles from './styles';

interface Props {
  url: string
}
const CreateButton: React.FunctionComponent<Props> = ({ url }) => {
  const classes = useStyles();
  return (
    <RouterLink to={url} className={classes.creteDocRouterLink}>
      <Button
        className={classes.createDocButton}
        id="ListPresenter-create"
        data-cy="equipment.specification.create"
      >
        <Text translation="equipment.specification.create" />
      </Button>
    </RouterLink>
  );
};

export default CreateButton;
