/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AppBar, Box, Button, Chip, Dialog, DialogContent, FormControlLabel, IconButton, Switch, Toolbar, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import cx from 'classnames';
import React, { useEffect, useState } from 'react';
import { ArcherContainer, ArcherElement } from 'react-archer';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { toastError } from '../../components/notifications';
import Colors from '../../layout/theme/utils/colors';
import { IBulkMigrationScanDetails, IMappedFrom, IRowData, ISchemaItem } from './interface';
import MappingRulesDrawer from './MappingRulesDrawer';
import PreviewDrawer from './PreviewDrawer';
import useStyles from './styles';
import ToSchemaItemMappingTable from './ToSchemaItemMappingTable';
import { autoMapArrays, canMapItems, getFromSchemaItemBgColor, isDisabledSchemaItem } from './utils';

const MigrationMappingDialog: React.FC<{
  isOpen: boolean
  handleClose: () => void
  updateScanMapping: (fromRevSchema: ISchemaItem[], toRevSchema: ISchemaItem[]) => void
  fromRev: DocumentRevision | undefined
  toRev: DocumentRevision | undefined
  scanDetails: IBulkMigrationScanDetails | null
}> = ({ isOpen, handleClose, updateScanMapping, fromRev, toRev, scanDetails }) => {
  const classes = useStyles();

  const [selectedSchemaItems, setSelectedSchemaItems] = useState<ISchemaItem[]>([]);

  const [fromRevSchema, setFromRevSchema] = useState<ISchemaItem[]>([]);
  const [toRevSchema, setToRevSchema] = useState<ISchemaItem[]>([]);

  const [unmappedCount, setUnmappedCount] = useState<number>(0);
  const [isShowRelationVisible, setIsShowRelationVisible] = useState<boolean>(false);

  const [isPreviewPanelVisible, setIsPreviewPanelVisible] = useState<boolean>(false);
  const [isMappingRulesPanelVisible, setIsMappingRulesPanelVisible] = useState<boolean>(false);

  useEffect(() => {
    if (fromRev?.id) {
      let revSchema = fromRev.formTemplate?.schema ?? [];
      revSchema = revSchema.filter(schemaItem => !schemaItem.deleted && !schemaItem.hidden);
      setFromRevSchema(revSchema);
    }

    if (toRev?.id) {
      let revSchema = toRev.formTemplate?.schema ?? [];
      revSchema = revSchema.filter(schemaItem => !schemaItem.deleted && !schemaItem.hidden);
      setToRevSchema(revSchema);
    }

    if (scanDetails?.id) {
      if (scanDetails.fromFormSchema && Array.isArray(scanDetails.fromFormSchema)
      && scanDetails.toFormSchema && Array.isArray(scanDetails.toFormSchema)) {
        setFromRevSchema(scanDetails.fromFormSchema);
        setToRevSchema(scanDetails.toFormSchema);
      }
    }
  }, [fromRev, toRev, scanDetails]);

  useEffect(() => {
    if (fromRevSchema?.length) {
      const unmappedItems = fromRevSchema.filter(fromRevSchemaItem => !fromRevSchemaItem.mappedToCount && !isDisabledSchemaItem(fromRevSchemaItem));
      setUnmappedCount(unmappedItems.length);
    }
  }, [fromRevSchema]);

  function handleMappingSave () {
    updateScanMapping(fromRevSchema, toRevSchema);
  }

  function handleMappingPreview () {
    setIsPreviewPanelVisible(true);
  }

  function handleClosePreview () {
    setIsPreviewPanelVisible(false);
  }

  function showMappingRules () {
    setIsMappingRulesPanelVisible(true);
  }

  function handleCloseMappingRulesPanel () {
    setIsMappingRulesPanelVisible(false);
  }

  function handleAutoMapping () {
    // Schema items with the same name or label can be auto mapped.
    const { fromRevSchema: modifiedFromRevSchema, toRevSchema: modifiedToRevSchema } = autoMapArrays(fromRevSchema, toRevSchema);
    setFromRevSchema([...modifiedFromRevSchema]);
    setToRevSchema([...modifiedToRevSchema]);
  }

  function handleFromSchemaItemClick (schemaItem: ISchemaItem) {
    // if (!isDisabledSchemaItem(schemaItem) && !schemaItem.isMapped) {
    if (!isDisabledSchemaItem(schemaItem)) {
      const isAlreadyPresent = selectedSchemaItems?.findIndex(item => item.name === schemaItem.name) > -1;
      if (isAlreadyPresent) {
        const filteredSelectedSchemaItems = selectedSchemaItems?.filter(item => item.name !== schemaItem.name);
        setSelectedSchemaItems(filteredSelectedSchemaItems);
      } else {
        setSelectedSchemaItems([...selectedSchemaItems, schemaItem]);
      }
    }
  }

  function handleRowColumnMapping (schemaItem: ISchemaItem, tableMappings: IRowData[], entryRemoved?: IMappedFrom) {
    if (!entryRemoved) {
      if (!selectedSchemaItems?.length) {
        return;
      }
    }

    setToRevSchema(toRevSchema.map(toRevSchemaItem => {
      if (toRevSchemaItem.name === schemaItem.name) {
        if (!entryRemoved) {
          const selectedSchemaItem = selectedSchemaItems[0];
          if (!toRevSchemaItem.mappedFrom) {
            toRevSchemaItem.mappedFrom = [];
          }
          toRevSchemaItem.mappedFrom.push(
            { name: selectedSchemaItem.name!, label: selectedSchemaItem.label!, isShowDirectly: false, type: selectedSchemaItem.type },
          );
        }

        toRevSchemaItem.tableMappings = tableMappings;
      }
      return toRevSchemaItem;
    }));

    if (entryRemoved) {
      handleMappedFromDelete(schemaItem, entryRemoved);
    } else {
      setFromRevSchemaItemMapped(selectedSchemaItems[0]);
      setSelectedSchemaItems([]);
    }
  }

  function handleToSchemaItemClick (toSchemaItem: ISchemaItem) {
    if (!selectedSchemaItems?.length) {
      return;
    }

    for (const selectedSchemaItem of selectedSchemaItems) {
      const { canMap, errMessage } = canMapItems(selectedSchemaItem, toSchemaItem);
      if (canMap) {
        // push into mappedFrom on toRevSchema item to selectedSchemaName.name
        setToRevSchema(toRevSchema.map(toRevSchemaItem => {
          if (toRevSchemaItem.name === toSchemaItem.name) {
            if (!toRevSchemaItem.mappedFrom) {
              toRevSchemaItem.mappedFrom = [];
            }
            toRevSchemaItem.mappedFrom.push(
              { name: selectedSchemaItem.name!, label: selectedSchemaItem.label!, isShowDirectly: true, type: selectedSchemaItem.type });
          }
          return toRevSchemaItem;
        }));

        // Set isMapped on fromRevSchema item to true
        setFromRevSchemaItemMapped(selectedSchemaItem);
      } else {
        toastError(errMessage);
      }
    }
    setSelectedSchemaItems([]);
  }

  function handleMappedFromDelete (schemaItem: ISchemaItem, mappedFromEntryToRemove: IMappedFrom) {
    setToRevSchema(toRevSchema.map(toRevSchemaItem => {
      if (toRevSchemaItem.name === schemaItem.name) {
        toRevSchemaItem.mappedFrom
          = toRevSchemaItem.mappedFrom?.filter(mappedFromItem => mappedFromItem.name !== mappedFromEntryToRemove.name);
      }
      return toRevSchemaItem;
    }));

    setFromRevSchema(fromRevSchema.map(fromRevSchemaItem => {
      if (fromRevSchemaItem.name === mappedFromEntryToRemove.name) {
        if (fromRevSchemaItem.mappedToCount) {
          fromRevSchemaItem.mappedToCount -= 1;
        }
      }
      return fromRevSchemaItem;
    }));
  }

  function setFromRevSchemaItemMapped (selectedSchemaItem: ISchemaItem) {
    setFromRevSchema(fromRevSchema.map(fromRevSchemaItem => {
      if (fromRevSchemaItem.name === selectedSchemaItem.name) {
        fromRevSchemaItem.mappedToCount = (fromRevSchemaItem.mappedToCount ?? 0) + 1;
      }
      return fromRevSchemaItem;
    }));
  }

  function showAllSelectOptions (schemaItem: ISchemaItem) {
    const options = schemaItem.options?.map((option, index) => option.value) ?? [];
    if (options?.length > 0) {
      return <span className={classes.mappingDialogSelectionOption}> - [ {options?.join(' | ')} ]</span>;
    } else {
      return <></>;
    }
  }

  function getBoxStyle () {
    const styleObject = {};

    if (!isShowRelationVisible) {
      Object.assign(styleObject, {
        maxHeight: '72vh',
        overflow: 'auto',
      });
    }

    return styleObject;
  }

  return (
    <Dialog
      fullScreen
      // scroll="paper"
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="migration-mapping-title"
    >
      <AppBar className={classes.relative}>
        <Toolbar className={classes.spaceBetweenFlex}>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6">
            Migration Form Schema Fields Mapping
          </Typography>
          <Box className={classes.spaceBetweenFlex}>
            <Button variant="text" color="secondary" onClick={showMappingRules}> Rules </Button>
            <Button color="primary" variant="contained" onClick={handleMappingSave}> Save </Button>
            { Array.isArray(scanDetails?.toFormSchema) && scanDetails?.toFormSchema?.length
                && <Button variant="outlined" onClick={handleMappingPreview}> Preview </Button> }
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={isShowRelationVisible}
                  onChange={event => setIsShowRelationVisible(event.target.checked)}
                  color="primary"
                  classes= {{
                    switchBase: classes.switchBase,
                  }}
                />
              }
              label="Show Mappings"
              className={classes.mappingSwitcher}
              labelPlacement="bottom"
            />
            <Button color="inherit" onClick={handleAutoMapping} variant="outlined"> Auto Map </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <ul className={classes.mappingDialogInstructions}>
          <li className={classes.compactListItem}>Click on a Schema Item on left. A <DoneAllIcon className={classes.doneAllIcon} /> would appear, indicating that this is selected.</li>
          <li className={classes.compactListItem}>Clicking on any item in the <em>To Rev</em> area, maps the two fields together.</li>
          <li className={classes.compactListItem}>More than one item from the left can be mapped to items on the right.</li>
          <li className={classes.compactListItem}>Click <b>Save</b> to make the <b>Preview</b> button appear. You can adjust the mapping rules, save, and preview as needed until you're satisfied with the results. Once everything looks good, close this screen, select the revisions from the table, and click <b>Run Scan</b> to fetch all the eligible revisions for selection.
          </li>
        </ul>
        {/* <MappingRules /> */}
        <Typography variant="subtitle2">{unmappedCount} fields unmapped | <b>{selectedSchemaItems.length}</b> fields selected</Typography>
        <Box className={classes.mappingArea}>
          <ArcherContainer
            strokeColor={Colors.font_gray}
            strokeWidth={0.75}
            className={cx(classes.spaceBetweenFlex, classes.width100)}
          >
            <Box style={{ width: '32%' }}>
              <Typography variant="h5" className={classes.mappingAreaTitle}>From Revision</Typography> - {fromRev?.displayRevision}
              <Box style={getBoxStyle()}>
                {fromRevSchema
                  .filter(schemaItem => !schemaItem.deleted)
                  .map(schemaItem => {
                    return (
                      <ArcherElement id={`from-${schemaItem.name!}`} key={`from-${schemaItem.name!}`}>
                        <Box className={classes.mappingRuleSchemaItemBox}
                          style={{ backgroundColor: getFromSchemaItemBgColor(schemaItem), cursor: 'pointer' }}
                          onClick={e => handleFromSchemaItemClick(schemaItem)}
                        >
                          <Typography variant="body2" color="primary"> {schemaItem.label} </Typography>
                          <Typography variant="caption" display="block" className={classes.capitalize}>
                            {schemaItem.type} { showAllSelectOptions(schemaItem) }
                          </Typography>
                          <Typography variant="caption" display="block"> {schemaItem.name} </Typography>
                          {
                            selectedSchemaItems?.map(selectedSchemaItems => selectedSchemaItems.name).includes(schemaItem.name)
                          && <DoneAllIcon className={classes.selectedFromSchemaItem} />
                          }
                        </Box>
                      </ArcherElement>
                    );
                  })}
              </Box>
            </Box>
            <Box style={{ width: '56%' }}>
              <Typography variant="h5" className={classes.mappingAreaTitle}>To Revision</Typography> - {toRev?.displayRevision}
              <Box style={getBoxStyle()}>
                {toRevSchema
                  .filter(schemaItem => !schemaItem.deleted)
                  .map(schemaItem => {
                    return (
                      <ArcherElement id={`to-${schemaItem.name!}`} key={`to-${schemaItem.name}`}
                        relations={isShowRelationVisible ? schemaItem.mappedFrom?.map(mappedFromEntry => ({
                          targetId: `from-${mappedFromEntry.name}`,
                          targetAnchor: 'right',
                          sourceAnchor: 'left',
                        })) : []}
                      >
                        <Box className={cx(classes.mappingRuleSchemaItemBox, classes.toSchemaItem)}
                          style={{
                            backgroundColor: isDisabledSchemaItem(schemaItem) ? Colors.hint_gray : '',
                          }}
                          onClick={e => handleToSchemaItemClick(schemaItem)}
                        >
                          <Box className={classes.width100}>
                            <Box className={classes.simpleFlex}>
                              <Typography variant="body2" color="primary"> {schemaItem.label} </Typography>
                              <Typography variant="caption" align="right"> {schemaItem.name} </Typography>
                            </Box>
                            <Typography variant="caption" display="block" className={classes.capitalize}>
                              {schemaItem.type} { showAllSelectOptions(schemaItem) }
                            </Typography>
                            {
                              schemaItem.referenceDataType === 'array'
                               && <ToSchemaItemMappingTable schemaItem={schemaItem}
                                 handleMappingChange={(row, entryRemoved) => handleRowColumnMapping(schemaItem, row, entryRemoved)}
                                 selectedSchemaItems={selectedSchemaItems}
                               />
                            }
                            {
                              schemaItem.referenceDataType === 'object'
                               && <ToSchemaItemMappingTable schemaItem={schemaItem}
                                 handleMappingChange={(row, entryRemoved) => handleRowColumnMapping(schemaItem, row, entryRemoved)}
                                 selectedSchemaItems={selectedSchemaItems}
                                 isSingleRow={true}
                               />
                            }
                          </Box>
                          {
                            (schemaItem.mappedFrom ?? []).length > 0 && schemaItem.mappedFrom?.map(mappedFromEntry => {
                              return mappedFromEntry.isShowDirectly && (
                                <Chip
                                  key={mappedFromEntry.label}
                                  label={mappedFromEntry.label}
                                  onDelete={e => handleMappedFromDelete(schemaItem, mappedFromEntry)}
                                  color="secondary"
                                  className={classes.chip}
                                />
                              );
                            })
                          }
                        </Box>
                      </ArcherElement>
                    );
                  })}
              </Box>
            </Box>
          </ArcherContainer>
        </Box>
      </DialogContent>

      {
        isPreviewPanelVisible
          && <PreviewDrawer isPreviewPanelVisible={isPreviewPanelVisible}
            handleClosePreview={handleClosePreview} scanDetails={scanDetails}
            toRevSchema={toRevSchema}
          />
      }
      <MappingRulesDrawer isOpen={isMappingRulesPanelVisible}
        handleClosePanel={handleCloseMappingRulesPanel}
      />
    </Dialog>
  );
};

export default MigrationMappingDialog;
