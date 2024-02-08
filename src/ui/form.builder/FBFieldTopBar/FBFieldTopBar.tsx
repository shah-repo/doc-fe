import { useSortable } from '@dnd-kit/sortable';
import { Box, Grid } from '@material-ui/core';
import CodeIcon from '@material-ui/icons/Code';
import React from 'react';
import { FBFieldTopBarProps } from '..';
import { ReactComponent as DragHandleIcon } from '../../../assets/images/drag_handle.svg';
import { ReactComponent as EditIcon } from '../../../assets/images/edit.svg';
import { ReactComponent as RemoveIcon } from '../../../assets/images/remove.svg';
import useStyles from './FBFieldTopBar.styles';
import { withFBFieldTopBar } from './FBFieldTopBar.wrap';
import cx from 'classnames';

const FBFieldTopBar: React.FunctionComponent<FBFieldTopBarProps> = ({
  editSchemaItem,
  removeSchemaItem,
  toggleItemMarkdown,
  inputProps = {},
}) => {
  const classes = useStyles();
  const { disabled, name = '' } = inputProps;
  const { listeners } = useSortable({ id: name });

  const deleteDisabled = inputProps.deleteDisabled || disabled;
  const editDisabled = disabled;
  const moveDisabled = disabled && !inputProps.moveable;

  return (
    <Box className={classes.root}>
      <Grid container className={classes.tools}>
        <DragHandleIcon
          data-cy="drag-schema-item"
          className={cx(classes.dragIcon, 'drag-handle', { [classes.disabledAction]: moveDisabled })}
          {...!moveDisabled && listeners}
        />
        <CodeIcon onClick={toggleItemMarkdown} data-cy="view-schema-item-markdown" />
        <EditIcon
          data-cy="edit-schema-item"
          className={cx({ [classes.disabledAction]: editDisabled })}
          onClick={editDisabled ? undefined : editSchemaItem}
        />
        <RemoveIcon
          data-cy="remove-schema-item"
          className={cx(
            deleteDisabled ? 'schema-delete-disabled' : 'schema-delete-enabled',
            { [classes.disabledAction]: deleteDisabled },
          )}
          {...!deleteDisabled && { onClick: removeSchemaItem }}
        />
      </Grid>
    </Box>
  );
};

export default withFBFieldTopBar(FBFieldTopBar);
