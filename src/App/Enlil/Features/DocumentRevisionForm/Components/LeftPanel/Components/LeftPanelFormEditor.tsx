import { Grid, Portal } from '@material-ui/core';
import { hasIn, isString } from 'lodash';
import React from 'react';
import { FBDialogProps } from '../../../../../../../ui/form.builder';
import { withFBLeftPanel } from '../../../../../../../ui/form.builder/FBLeftPanel/FBLeftPanel.wrap';
import useStyles from './LeftPanelFormEditor.styles';

const LeftPanelFormEditor: React.FunctionComponent<FBDialogProps> = ({
  handleActionsRef,
  handleTitleRef,
  portalAction,
  portalTitle,
  title,
  content,
  actions,
}) => {
  const classes = useStyles();

  return (
    <Grid container className={classes.root}>
      <Grid item>
        <div ref={handleTitleRef} />
      </Grid>
      <Grid item className={classes.grid}>
        {content && portalTitle && portalAction && (
          <content.type {...content.props}>
            {content.props.children}
            {!isString(title) && !hasIn(title, 'locale') && (
              <Portal container={portalTitle}>
                {title}
              </Portal>
            )}
            <Portal container={portalAction}>
              {actions}
            </Portal>
          </content.type>
        )}
      </Grid>
      <Grid item className={classes.actions}>
        <div ref={handleActionsRef} />
      </Grid>
    </Grid>
  );
};

export default withFBLeftPanel(LeftPanelFormEditor);
