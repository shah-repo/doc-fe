import { Box, Drawer, LinearProgress, List, ListItem, ListItemText, TextField, Typography } from '@material-ui/core';
import HourglassFullIcon from '@material-ui/icons/HourglassFull';
import cx from 'classnames';
import React, { useEffect, useState } from 'react';
import ReactJson from 'react-json-view';
import { translate } from '../../../common/intl';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { FB, FBFormState, FBInputProps, FBProvider, FBSchemaState } from '../../form.builder';
import DialogHeader from './DrawerHeader';
import { IBulkMigrationScanDetails, ISchemaItem } from './interface';
import useStyles from './styles';
import { useBulkMigration } from './useBulkMigration';
import { isDisabledSchemaItem } from './utils';

interface PreviewDrawerProps {
  isPreviewPanelVisible: boolean
  handleClosePreview: () => void
  toRevSchema: ISchemaItem[]
  scanDetails: IBulkMigrationScanDetails | null
}

interface PreviewDocRev extends DocumentRevision {
  formInputKeysCount: number
}

const PreviewDrawer: React.FC<PreviewDrawerProps> = ({
  isPreviewPanelVisible,
  handleClosePreview,
  toRevSchema,
  scanDetails,
}) => {
  const classes = useStyles();
  const formState = FB.useRef<FBFormState>(FBFormState, {});
  const {
    isLoading,
    previewDocRevsList,
    filteredDocRevsList,
    setFilteredDocRevsList,
    newFormInput,
    fieldsUnmatched,
    fetchAllEligibleRevisions,
    getPreviewForDocRev,
  } = useBulkMigration();

  const [selectedPreviewDocRev, setSelectedPreviewDocRev] = useState<PreviewDocRev>();

  useEffect(() => {
    if (scanDetails?.id) {
      fetchAllEligibleRevisions(scanDetails.id);
    }
  }, []);

  const handlePreviewItemClick = (docRevSelected: PreviewDocRev) => {
    setSelectedPreviewDocRev(docRevSelected);
    if (scanDetails?.id) {
      getPreviewForDocRev(scanDetails.id, docRevSelected, formState);
    }
  };

  const searchTextChanged = (searchText: string) => {
    if (!searchText) {
      setFilteredDocRevsList(previewDocRevsList);
    } else {
      const filteredRevs = previewDocRevsList.filter(
        (docRev) => docRev.document?.docId.includes(searchText) || docRev.name.includes(searchText),
      );
      setFilteredDocRevsList(filteredRevs);
    }
  };

  const componentToRender = (controlProps: FBInputProps): React.ReactNode | undefined => {
    const { type, name, index } = controlProps;
    const schemaControl = FBSchemaState.control[type || ''];
    if (!schemaControl) {
      return;
    }
    return React.createElement(schemaControl, {
      key: `fb-control-${type}-${name}-${index}`,
      ...controlProps,
    });
  };

  return (
    <FBProvider
      {...{
        formState,
      }}
    >
      <Drawer
        anchor="right"
        open={isPreviewPanelVisible}
        onClose={handleClosePreview}
        classes={{ paper: classes.previewDrawerDialogPaper }}
      >
        <Box className={classes.previewDrawerDialog}>
          <Box className={classes.previewDrawerContent}>
            {/* Left Section */}
            <div className={classes.previewDrawerLeftSection}>
              <TextField
                size="small"
                variant="outlined"
                placeholder="Search"
                className={classes.width100}
                onChange={(event) => searchTextChanged(event.target.value)}
              />
              {filteredDocRevsList.length > 0 && (
                <List dense={true}>
                  {filteredDocRevsList.map((docRev, index) => {
                    const primaryText = `[${index + 1}] ${docRev.document?.docId} • ${docRev.name}`;
                    const secondaryText = `Rev ${docRev.displayRevision} • ${docRev.displayStatus}`;
                    return (
                      <ListItem
                        className={classes.previewDrawerLeftSectionListItem}
                        selected={docRev.id === selectedPreviewDocRev?.id}
                        onClick={() => handlePreviewItemClick(docRev)}
                      >
                        <ListItemText primary={primaryText} secondary={secondaryText} />
                        <ListItemText className={classes.textRightAlign}>
                          <Typography variant="caption">
                            {translate('bulk.migration.mapping.preview.keys.mapped', {
                              count: docRev.formInputKeysCount,
                            })}
                          </Typography>
                        </ListItemText>
                      </ListItem>
                    );
                  })}
                </List>
              )}
            </div>
            {/* Right Section */}
            <div className={classes.previewDrawerRightSection}>
              <DialogHeader title={translate('bulk.migration.mapping.preview')} onDialogClose={handleClosePreview} />
              {isLoading && <LinearProgress className={classes.previewDrawerProgress} data-cy="saving-progress-bar" />}
              <Box className={classes.previewSection}>
                {((selectedPreviewDocRev?.id && isLoading) || !selectedPreviewDocRev?.id) && (
                  <Box className={classes.previewMessageContainer}>
                    {!selectedPreviewDocRev?.id && (
                      <Typography variant="h5" align="center">
                        {translate('bulk.migration.mapping.preview.selection.info.message')}
                      </Typography>
                    )}

                    {selectedPreviewDocRev?.id && isLoading && (
                      <Typography variant="h5" align="center">
                        <HourglassFullIcon className={classes.previewProgressIcon} />
                        {translate('bulk.migration.mapping.preview.selection.progress')}
                      </Typography>
                    )}
                  </Box>
                )}
                {!isLoading && selectedPreviewDocRev?.id && (
                  <>
                    <Box className={classes.rightSectionFieldsUnmatched}>
                      {fieldsUnmatched && (
                        <>
                          <Typography variant="h5" className={classes.marginBottom8}>
                            {translate('bulk.migration.mapping.preview.selection.unmatched')}
                          </Typography>
                          <ReactJson src={fieldsUnmatched} collapsed={1} />
                        </>
                      )}
                    </Box>
                    <Box className={classes.rightSectionMappingView}>
                      {newFormInput && (
                        <>
                          <Typography variant="h5" className={classes.marginBottom8}>
                            {translate('bulk.migration.mapping.preview.selection.mapped.fields')}{' '}
                          </Typography>
                          {toRevSchema
                            .filter((schemaItem) => !schemaItem.deleted)
                            .map((schemaItem) => {
                              return (
                                <Box
                                  className={cx(classes.previewDrawerMappingRuleSchemaItemBox, {
                                    grey: isDisabledSchemaItem(schemaItem),
                                  })}
                                  key={schemaItem.name}
                                >
                                  <Box className={classes.width100}>{componentToRender(schemaItem)}</Box>
                                </Box>
                              );
                            })}
                        </>
                      )}
                    </Box>
                  </>
                )}
              </Box>
            </div>
          </Box>
        </Box>
      </Drawer>
    </FBProvider>
  );
};

export default PreviewDrawer;
