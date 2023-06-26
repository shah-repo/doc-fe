import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { isEmpty } from 'lodash';
import { Observer } from 'mobx-react';
import React from 'react';
import { SMButton, SMDialogAction, SMDialogProps, SMMap, SMText } from '../../..';
import { withSMDialogWrap } from './SMDialog.wrap';

const SMDialog: React.FunctionComponent<SMDialogProps> = ({
  onDialogActionClick,
  dialogState,
  actions = [],
  maxWidth = 'sm',
  title,
  children,
}) =>  (
  <Observer>
    {() => (
      <Dialog
        open={dialogState?.isOpen || false}
        fullWidth={true}
        {...{ maxWidth }}
      >
        {title && (
          <DialogTitle>
            <SMText label={title} />
          </DialogTitle>
        )}
        <DialogContent>
          {children}
        </DialogContent>
        {!isEmpty(actions) && (
          <DialogActions>
            <SMMap<SMDialogAction[]> collection={actions}>
              {(action: SMDialogAction, index) => (
                <SMButton
                  key={`sm-dialog-${action}-${index}`}
                  onClick={() => onDialogActionClick?.(action)}
                  label={`form.builder.${action}`}
                />
              )}
            </SMMap>
          </DialogActions>
        )}
      </Dialog>
    )}
  </Observer>
);

export default withSMDialogWrap(SMDialog);
