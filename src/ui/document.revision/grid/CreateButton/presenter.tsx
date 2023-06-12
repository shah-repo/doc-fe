import { Button } from '@material-ui/core';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Text from '../../../components/Text';
import styles from './styles';

interface Props {
  url: string;
}
const CreateButton: React.FunctionComponent<Props> = ({ url }) => {
  const classes = styles();
  return (
    <RouterLink to={url} style={{ textDecoration: 'none' }}>
      <Button
        className={classes.createDocButton}
        id="ListPresenter-create"
        data-cy="document.revision.create"
      >
        <Text translation="document.revision.create" />
      </Button>
    </RouterLink>
  );
};

export default CreateButton;
