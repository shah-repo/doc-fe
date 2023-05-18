import { Box, Grid } from '@material-ui/core';
import CachedIcon from '@material-ui/icons/Cached';
import CancelIcon from '@material-ui/icons/Cancel';
import SuccessIcon from '@material-ui/icons/CheckCircle';
import { isEmpty } from 'lodash';
import { Observer } from 'mobx-react';
import React from 'react';
import { useIntl } from 'react-intl';
import { FBFileField, FBFilesPresenter, FBFZIPUploadProps, FBInput, FBProvider, FBUnzipStatus } from '..';
import Colors from '../../layout/theme/utils/colors';
import FBButton from '../components/inputs/FBButton';
import { FBFontStyle } from '../styles/FBFont.styles';
import FBZIPFileSocket from './FBZIPFile.socket';
import { withFBZIPUpload } from './FBZIPUpload.wrap';

const ZIPUploadChild: React.FunctionComponent<FBFZIPUploadProps> = ({
  name,
  disabled,
  files,
  readonly = false,
  disableFileUpload = false,
  disableUnzipButton = false,
  unzipStatus,
  fileUploadState,
  startUnzip,
}) => {
  const intl = useIntl();
  const getStatus = () => {
    switch (fileUploadState?.unzipStatus) {
      case FBUnzipStatus.DONE:
        return intl.formatMessage({ id: 'form.builder.unzip.status.done' });
      case FBUnzipStatus.PROCESSING:
        return intl.formatMessage({ id: 'form.builder.unzip.status.processing' });
      case FBUnzipStatus.FAILED:
        return intl.formatMessage({ id: 'form.builder.unzip.status.failed' });
      default:
        return '';
    }
  };
  return (
    <>
      {!readonly && (
        <FBFileField
          key={`fb-zip-attachment-field-${name}`}
          name={name}
          disabled= {disableFileUpload || disabled}
          typeToAccept=".zip"
        />
      )}
      <Observer>
        {() => (
          <>
            {!isEmpty(files) && (
              <Grid container>
                <Grid item xs={8}>
                  <FBFilesPresenter
                    boxProps={{ mt: 2 }}
                    {...{ files, disabled, name }}
                  />
                </Grid>
                <Grid item xs={4} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    {fileUploadState?.unzipStatus &&
                <Box
                  css={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0 1.6em',
                    fontWeight: 600,
                    fontSize: '12px',
                    lineHeight: '15px',
                    alignItems: 'center',
                    position: 'absolute',
                  }}
                  color={Colors.almost_black}
                >
                  {fileUploadState?.unzipStatus === FBUnzipStatus.DONE ?
                    <SuccessIcon fontSize="small" style={{ color: Colors.latest_green_varient }} />
                    : (fileUploadState?.unzipStatus === FBUnzipStatus.PROCESSING ?
                      <CachedIcon fontSize="small" style={{ color: Colors.font_gray }} /> :
                      <CancelIcon fontSize="small" style={{ color: Colors.latest_red_varient }} />)
                  }
                  <b style={{ marginLeft: '10px' }}>
                    {getStatus()}
                  </b>
                </Box>}
                  </Grid>
                  <Grid item xs={12} style={{ maxWidth: 'fit-content' }}>
                    <FBButton
                      key={`fb-zip-attachment-button-${name}`}
                      label={'form.builder.unzip.files'}
                      onClick={() => { startUnzip(); }}
                      disabled= {
                        (fileUploadState?.unzipStatus === FBUnzipStatus.PROCESSING) || disableUnzipButton || disabled
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
            )}
          </>
        )}
      </Observer>
    </>
  );
};
const FBZIPUpload: React.FunctionComponent<FBFZIPUploadProps> = ({
  fileUploadState,
  ...props
}) =>  (
  <FBProvider {...{ fileUploadState }}>
    <FBZIPFileSocket docRevisionId={props.docRevisionId} />
    <FBInput labelProps={FBFontStyle.labelProps} {...props} type="zipattachment">
      <ZIPUploadChild  {...props} {...{ fileUploadState }} />
    </FBInput>
  </FBProvider>
);

export default withFBZIPUpload(FBZIPUpload);
