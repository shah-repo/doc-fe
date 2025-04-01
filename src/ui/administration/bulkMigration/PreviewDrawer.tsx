import { Box, Button, Drawer, LinearProgress, List, ListItem, ListItemText, TextField, Typography } from '@material-ui/core';
import HourglassFullIcon from '@material-ui/icons/HourglassFull';
import React, { useEffect, useState } from 'react';
import ReactJson from 'react-json-view';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { FB, FBFormState, FBInputProps, FBProvider, FBSchemaState } from '../../form.builder';
import Colors from '../../layout/theme/utils/colors';
import { IBulkMigrationScanDetails, ISchemaItem } from './interface';
import useStyles from './styles';
import { useBulkMigration } from './useBulkMigration';
import { isDisabledSchemaItem } from './utils';

const PreviewDrawer: React.FC<{
  isPreviewPanelVisible: boolean
  handleClosePreview: () => void
  toRevSchema: ISchemaItem[]
  scanDetails: IBulkMigrationScanDetails | null
}> = ({ isPreviewPanelVisible, handleClosePreview, toRevSchema, scanDetails }) => {
  const classes = useStyles();

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

  const [selectedPreviewDocRev, setSelectedPreviewDocRev] = useState<DocumentRevision & {formInputKeysCount: number}>();
  const formState = FB.useRef<FBFormState>(FBFormState, {});

  useEffect(() => {
    fetchAllEligibleRevisions();
  }, []);

  const handlePreviewItemClick = (docRevSelected) => {
    setSelectedPreviewDocRev(docRevSelected);
    getPreviewForDocRev(docRevSelected, formState);
  };

  function searchTextChanged (searchText: string) {
    if (!searchText) {
      setFilteredDocRevsList(previewDocRevsList);
    } else {
      const filteredRevs = previewDocRevsList.filter(
        docRev => docRev.document?.docId.includes(searchText) || docRev.name.includes(searchText),
      );
      setFilteredDocRevsList(filteredRevs);
    }
  }

  function componentToRender (controlProps: FBInputProps): React.ReactNode | undefined {
    const { type, name, index } = controlProps;
    const schemaControl = FBSchemaState.control[type || ''];
    if (!schemaControl) {
      return;
    }
    return React.createElement(schemaControl, {
      key: `fb-control-${type}-${name}-${index}`,
      ...controlProps,
    });
  }

  return (
    <FBProvider {...{
      formState,
    }}>
      <Drawer
        anchor="right"
        open={isPreviewPanelVisible}
        onClose={handleClosePreview}
        classes={{ paper: classes.previewDrawerDialogPaper }}
      >
        <Box className={classes.previewDrawerDialog}>
          <Button onClick={handleClosePreview} className={classes.previewDrawerDialogCloseButton}>Close</Button>
          {isLoading && (
            <LinearProgress
              className={classes.previewDrawerProgress}
              data-cy="saving-progress-bar"
            />
          )}
          <Box className={classes.previewDrawerContent}>
            {/* Left Section */}
            <div className={classes.previewDrawerLeftSection}>
              <TextField size="small" variant="outlined" placeholder="Search" className={classes.width100}
                onChange={e => searchTextChanged(e.target.value)} />
              {filteredDocRevsList.length > 0
                && <List dense={true}>
                  {filteredDocRevsList.map((docRev, index) => {
                    const primaryText = `[${index + 1}] ${docRev.document?.docId} • ${docRev.name}`;
                    const secondaryText = `Rev ${docRev.displayRevision} • ${docRev.displayStatus}`;
                    return (<ListItem className={classes.previewDrawerLeftSectionListItem}
                      selected={docRev.id === selectedPreviewDocRev?.id}
                      onClick={e => handlePreviewItemClick(docRev)}
                    >
                      <ListItemText
                        primary={primaryText}
                        secondary={secondaryText}
                      />
                      <ListItemText className={classes.textRightAlign}>
                        <Typography variant="caption">{docRev.formInputKeysCount} keys mapped</Typography>
                      </ListItemText>
                    </ListItem>);
                  })}
                </List>}
            </div>
            {/* Right Section */}
            <div className={classes.previewDrawerRightSection}>
              {!selectedPreviewDocRev?.id
                && <Typography variant="h4" color="primary"> Click on a Document Revision from the left to see its preview here. </Typography>
              }
              {selectedPreviewDocRev?.id && isLoading
                && <Typography variant="h4" color="primary"> <HourglassFullIcon /> Generating Preview.... </Typography>
              }
              {
                !isLoading && selectedPreviewDocRev?.id
              && <>
                <Box className={classes.rightSectionFieldsUnmatched}>
                  { fieldsUnmatched && <>
                    <Typography variant="h5" className={classes.marginBottom8}> Fields Unmatched </Typography>
                    <ReactJson src={fieldsUnmatched} collapsed={1} />
                  </> }
                </Box>
                <Box className={classes.rightSectionMappingView}>
                  { newFormInput
                      && <>
                        <Typography variant="h5" className={classes.marginBottom8}> Mapped Fields </Typography>
                        {
                          toRevSchema.filter(schemaItem => !schemaItem.deleted)
                            .map(schemaItem => {
                              return (
                                <Box className={classes.previewDrawerMappingRuleSchemaItemBox}
                                  style={{
                                    backgroundColor: isDisabledSchemaItem(schemaItem) ? Colors.hint_gray : '',
                                  }}
                                  key={schemaItem.name}
                                >
                                  <Box className={classes.width100}>{componentToRender(schemaItem)}</Box>
                                </Box>
                              );
                            })
                        }
                      </>
                  }
                </Box>
              </>
              }
            </div>
          </Box>
        </Box>
      </Drawer>
    </FBProvider>
  );
};

export default PreviewDrawer;
