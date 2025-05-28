import { light, regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  Drawer,
  InputAdornment,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@material-ui/core';
import HourglassFullIcon from '@material-ui/icons/HourglassFull';
import cx from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import ReactJson from 'react-json-view';
import { translate } from '../../../common/intl';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { FB, FBFormState, FBInputProps, FBProvider, FBSchemaState, FBWorkspaceState } from '../../form.builder';
import DialogHeader from './DrawerHeader';
import { BulkMigrationScanDetails, FormFieldSchema } from './interface';
import useStyles from './styles';
import { useBulkMigration } from './useBulkMigration';
import { isDisabledSchemaItem } from './utils';

interface PreviewDrawerProps {
  isPreviewPanelVisible: boolean
  handleClosePreview: () => void
  toRevSchema: FormFieldSchema[]
  scanDetails: BulkMigrationScanDetails | null
  workspaceState?: FBWorkspaceState
}

interface PreviewDocRev extends DocumentRevision {
  formInputKeysCount: number
}

const PreviewDrawer: React.FC<PreviewDrawerProps> = ({
  isPreviewPanelVisible,
  handleClosePreview,
  workspaceState,
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
  const [searchText, setSearchText] = useState<string>('');

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

  const searchTextChanged = useCallback(
    (text: string) => {
      setSearchText(text);
      const trimmedText = text.trim().toLowerCase();

      if (!trimmedText) {
        setFilteredDocRevsList(previewDocRevsList);
        return;
      }

      const filtered = previewDocRevsList.filter(({ document, name }) => {
        const docId = document?.docId?.toLowerCase() || '';
        return docId.includes(trimmedText) || name.toLowerCase().includes(trimmedText);
      });

      setFilteredDocRevsList(filtered);
    },
    [previewDocRevsList],
  );

  useEffect(() => {
    if (newFormInput && Object.keys(newFormInput).length
      && workspaceState
      && selectedPreviewDocRev
    ) {
      workspaceState.setId(selectedPreviewDocRev?.id);
      workspaceState?.setFormInputDirectly(newFormInput);
    }
  }, [newFormInput]);

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
        workspaceState,
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
                value={searchText}
                className={classes.width100}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon icon={light('search')} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <>
                      {searchText && (
                        <InputAdornment position="end" className={classes.clear}>
                          <FontAwesomeIcon
                            icon={regular('xmark')}
                            onClick={() => searchTextChanged('')}
                            aria-label="Clear search"
                            data-cy="keyword-search-clear"
                          />
                        </InputAdornment>
                      )}
                    </>
                  ),
                }}
                onChange={(event) => searchTextChanged(event.target.value)}
              />
              {filteredDocRevsList.length > 0 && (
                <List dense>
                  {filteredDocRevsList.map((docRev) => {
                    const { id, name, displayRevision, displayStatus, formInputKeysCount, document } = docRev;
                    const revInfo = `${document?.docId} • ${name} Rev ${displayRevision} • ${displayStatus}`;
                    return (
                      <ListItem
                        className={classes.previewDrawerLeftSectionListItem}
                        selected={id === selectedPreviewDocRev?.id}
                        onClick={() => handlePreviewItemClick(docRev)}
                        key={revInfo}
                      >
                        <ListItemText
                          className={classes.listItemText}
                          primary={<Typography className={classes.listItemText}>{revInfo}</Typography>}
                          secondary={
                            <Typography variant="body2" noWrap>
                              {translate('bulk.migration.mapping.preview.keys.mapped', {
                                count: formInputKeysCount,
                              })}
                            </Typography>
                          }
                        />
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
