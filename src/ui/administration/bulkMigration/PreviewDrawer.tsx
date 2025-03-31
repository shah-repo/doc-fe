import { Box, Button, Drawer, LinearProgress, List, ListItem, ListItemText, makeStyles, TextField, Typography } from '@material-ui/core';
import HourglassFullIcon from '@material-ui/icons/HourglassFull';
import { AxiosRequestConfig } from 'axios';
import React, { useEffect, useState } from 'react';
import ReactJson from 'react-json-view';
import apiClient from '../../../state/apiClient';
import { BULK_MIGRATION_GET_REVISION_MAPPING_PREVIEW, BULK_MIGRATION_GET_SCAN_REVISIONS_FOR_PREVIEW } from '../../../state/ducks/company/constants';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { store } from '../../../state/store';
import { toastError } from '../../components/notifications';
import { FB, FBFormState, FBInputProps, FBProvider, FBSchemaState } from '../../form.builder';
import { Colors as ThemeColors } from '../../layout/theme-next';
import Colors from '../../layout/theme/utils/colors';
import { IBulkMigrationScanDetails, ISchemaItem } from './interface';
import { isDisabledSchemaItem } from './utils';

const useStyles = makeStyles((theme) => ({
  progress: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  dialogPreviewDrawer: {
    width: '80vw', // Width of the side panel
    display: 'flex',
    flexDirection: 'column',
    height: '100%', // Full height of the drawer
  },
  dialogPreviewDrawerPaper: {
    width: '80vw',
  },
  drawerContent: {
    display: 'flex',
    flexGrow: 1, // Allow sections to take full available height
    flexDirection: 'row',
  },
  leftSection: {
    width: '25%', // Left section takes 25% width
    borderRight: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(2),
    boxSizing: 'border-box',
    height: '92vh',
    overflow: 'auto',
  },
  rightSection: {
    width: '75%', // Right section takes 75% width
    padding: theme.spacing(2),
    boxSizing: 'border-box',
    height: '92vh',
  },
  rightSectionFieldsUnmatched: {
    height: '20%',
    overflow: 'auto',
  },
  rightSectionMappingView: {
    height: '75%',
    overflow: 'auto',
  },
  dialogPreviewDrawerCloseButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  listItem: {
    borderRadius: 4,
    padding: theme.spacing(1, 1.25),
    marginBottom: theme.spacing(0.5),
    color: ThemeColors.textGray,
    fontSize: 12,
    minHeight: 0,
    cursor: 'pointer',

    '&.Mui-selected': {
      backgroundColor: ThemeColors.lightGray,
      color: ThemeColors.primaryDark,
      fontWeight: 600,

      '&:hover': {
        backgroundColor: ThemeColors.lightGray,
      },
    },
    '&:hover': {
      backgroundColor: ThemeColors.lightGray,
    },
  },
  mappingRuleSchemaItemBox: {
    position: 'relative',
    marginTop: '8px',
    borderRadius: '2px',
    padding: '8px',
    width: '100%',
  },
}));

const PreviewDrawer: React.FC<{
  isPreviewPanelVisible: boolean
  handleClosePreview: () => void
  toRevSchema: ISchemaItem[]
  scanDetails: IBulkMigrationScanDetails | null
}> = ({ isPreviewPanelVisible, handleClosePreview, toRevSchema, scanDetails }) => {
  const classes = useStyles();

  const [isLoading, setIsLoading] = useState(false);

  const [previewDocRevsList, setPreviewDocRevsList] = useState<Array<DocumentRevision & {formInputKeysCount: number}>>([]);
  const [filteredDocRevsList, setFilteredDocRevsList] = useState<Array<DocumentRevision & {formInputKeysCount: number}>>([]);

  const [selectedPreviewDocRev, setSelectedPreviewDocRev] = useState<DocumentRevision & {formInputKeysCount: number}>();
  const [newFormInput, setNewFormInput] = useState<{[key: string]: any}>();
  const [fieldsUnmatched, setFieldsUnmatched] = useState<{[key: string]: any}>();

  const formState = FB.useRef<FBFormState>(FBFormState, {});

  function fetchAllEligibleRevisions () {
    setIsLoading(true);

    const requestConfig: AxiosRequestConfig = {
      method: 'get',
      url: `${BULK_MIGRATION_GET_SCAN_REVISIONS_FOR_PREVIEW}/${scanDetails?.id}`,
      headers: {
        Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
      },
      // cancelToken: call.token,
    };
    apiClient
      .request(requestConfig)
      .then((resp) => resp)
      .then(({ data }) => {
        setPreviewDocRevsList(data);
        setFilteredDocRevsList(data);
        setIsLoading(false);
      })
      .catch((exception) => {
        setIsLoading(false);
        toastError(exception?.response.data?.message);
      });
  }

  function getPreviewForDocRev (docRevSelected: DocumentRevision) {
    setIsLoading(true);

    const requestConfig: AxiosRequestConfig = {
      method: 'get',
      url: `${BULK_MIGRATION_GET_REVISION_MAPPING_PREVIEW}/${scanDetails?.id}/${docRevSelected.id}`,
      headers: {
        Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
      },
      // cancelToken: call.token,
    };
    apiClient
      .request(requestConfig)
      .then((resp) => resp)
      .then(({ data }) => {
        const { newFormInput, fieldNamesUnmatched } = data;
        setNewFormInput(newFormInput);
        setFieldsUnmatched(fieldNamesUnmatched);

        formState?.setValues(newFormInput);
        setIsLoading(false);
      })
      .catch((exception) => {
        setIsLoading(false);
        toastError(exception?.response.data?.message);
      });
  }

  useEffect(() => {
    fetchAllEligibleRevisions();
  }, []);

  const handlePreviewItemClick = (docRevSelected) => {
    setSelectedPreviewDocRev(docRevSelected);
    getPreviewForDocRev(docRevSelected);
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
        classes={{ paper: classes.dialogPreviewDrawerPaper }}
      >
        <Box className={classes.dialogPreviewDrawer}>
          <Button onClick={handleClosePreview}>Close</Button>
          {isLoading && (
            <LinearProgress
              className={classes.progress}
              data-cy="saving-progress-bar"
            />
          )}
          <Box className={classes.drawerContent}>
            {/* Left Section */}
            <div className={classes.leftSection}>
              <TextField size="small" variant="outlined" placeholder="Search" style={{ width: '100%' }}
                onChange={e => searchTextChanged(e.target.value)} />
              {filteredDocRevsList.length > 0
                && <List dense={true}>
                  {filteredDocRevsList.map((docRev, index) => {
                    const primaryText = `[${index + 1}] ${docRev.document?.docId} • ${docRev.name}`;
                    const secondaryText = `Rev ${docRev.displayRevision} • ${docRev.displayStatus}`;
                    return (<ListItem className={classes.listItem}
                      selected={docRev.id === selectedPreviewDocRev?.id}
                      style={{ display: 'flex', justifyContent: 'space-between' }}
                      onClick={e => handlePreviewItemClick(docRev)}
                    >
                      <ListItemText
                        primary={primaryText}
                        secondary={secondaryText}
                      />
                      <ListItemText style={{ textAlign: 'right' }}>
                        <Typography variant="caption">{docRev.formInputKeysCount} keys mapped</Typography>
                      </ListItemText>
                    </ListItem>);
                  })}
                </List>}
            </div>
            {/* Right Section */}
            <div className={classes.rightSection}>
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
                    <Typography variant="h5" style={{ marginBottom: '4px' }}> Fields Unmatched </Typography>
                    <ReactJson src={fieldsUnmatched} collapsed={1} />
                  </> }
                </Box>
                <Box className={classes.rightSectionMappingView}>
                  { newFormInput
                      && <>
                        <Typography variant="h5" style={{ marginBottom: '4px' }}> Mapped Fields </Typography>
                        {
                          toRevSchema.filter(schemaItem => !schemaItem.deleted)
                            .map(schemaItem => {
                              return (
                                <Box className={classes.mappingRuleSchemaItemBox}
                                  style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '8px',
                                    backgroundColor: isDisabledSchemaItem(schemaItem) ? Colors.hint_gray : '',
                                    overflow: 'auto',
                                  }}
                                  key={schemaItem.name}
                                >
                                  <Box style={{ width: '100%' }}>{componentToRender(schemaItem)}</Box>
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
