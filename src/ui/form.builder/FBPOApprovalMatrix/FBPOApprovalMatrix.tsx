import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box } from '@material-ui/core';
import { Provider } from 'mobx-react';
import React from 'react';
import { FBDialog, FBInput, FBSection, FBTooltip } from '..';
import { translate } from '../../../common/intl';
import { Button, IconButton } from '../../components/forms/fields-next';
import { FBPOApprovalMatrixFieldProps, FBPOApprovalMatrixTableProps } from './FBPOApprovalMatrix.types';
import { withFBPOApprovalMatrix } from './FBPOApprovalMatrix.wrap';
import FBPOApprovalMatrixTable from './table/FBPOApprovalMatrixTable';

const FBPOApprovalMatrix: React.FunctionComponent<FBPOApprovalMatrixFieldProps> = ({
  handleAdd,
  handleRevert,
  poamState,
  dialogState,
  name = '',
  autosave,
  ...props
}) => {
  return (
    <Provider {...{ poamState, dialogState }}>
      <FBDialog />
      <Box pb={2}>
        <FBInput {...{ name, autosave }} disabled={props.disabled} type="poApprovalMatrix">
          <FBSection name={`fb-poam-section-${name}`} label={props.label}>
            <Box display="flex" flexDirection="row-reverse">
              <FBTooltip title="form.builder.poam.button.revert">
                <IconButton
                  kind="form"
                  onClick={handleRevert}
                >
                  <FontAwesomeIcon icon={regular('rotate-left')} />
                </IconButton>
              </FBTooltip>
            </Box>
          </FBSection>
        </FBInput>
        <FBPOApprovalMatrixTable
          {...props as FBPOApprovalMatrixTableProps}
          name={name}
        />
        {!props.disabled && (
          <Button
            attached
            fullWidth
            kind="add"
            onClick={handleAdd}
            data-cy="fb-control-btn"
          >
            {translate('form.builder.add.line.item')}
          </Button>
        )}
      </Box>
    </Provider>
  );
};

export default withFBPOApprovalMatrix(FBPOApprovalMatrix);
