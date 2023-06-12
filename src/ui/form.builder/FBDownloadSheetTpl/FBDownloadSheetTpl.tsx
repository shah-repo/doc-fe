import { Box } from '@material-ui/core';
import { GetApp } from '@material-ui/icons';
import React from 'react';
import { FBButton, FBDownloadSheetTplProps } from '..';
import { withFBDownloadSheetTpl } from './FBDownloadSheetTpl.wrap';

const FBDownloadSheetTpl: React.FunctionComponent<FBDownloadSheetTplProps> = ({
  label,
  name,
  disabled,
  handleAction,
  ...props
}) => (

  <Box display="flex" flexDirection="row">
    <FBButton
      startIcon={<GetApp width={20} height={20} style={{ marginRight: 4 }}/>}
      key={'downloadsheet'}
      label={label}
      variant="contained"
      style={{ margin: '0 0 2px 0', padding: '10px 20px' }}
      onClick={() => handleAction?.()}
      {...{ disabled }}
    />
  </Box>
);

export default withFBDownloadSheetTpl(FBDownloadSheetTpl);
