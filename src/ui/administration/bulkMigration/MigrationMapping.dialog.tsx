/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AppBar, Box, Chip, Dialog, DialogContent, Toolbar, Typography } from '@material-ui/core';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import cx from 'classnames';
import React, { useEffect, useState } from 'react';
import { ArcherContainer, ArcherElement } from 'react-archer';
import { translate } from '../../../common/intl';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { Button, FormControlLabel, Switch } from '../../components/forms/fields-next';
import { toastError } from '../../components/notifications';
import { MigrationSpecialFields } from '../../documentRevision/forms/presenters/change.document.form/utils/constants';
import Colors from '../../layout/theme/utils/colors';
import InfoIndicator from '../announcements/InfoIndicator';
import { IndicatorTypeEnum } from '../announcements/interface';
import { IBulkMigrationScanDetails, IMappedFrom, IOption, IRowData, ISchemaItem } from './interface';
import MappingRulesDrawer from './MappingRulesDrawer';
import OptionMapperDrawer from './OptionMapperDrawer';
import PreviewDrawer from './PreviewDrawer';
import useStyles from './styles';
import ToSchemaItemMappingTable from './ToSchemaItemMappingTable';
import { useBulkMigration } from './useBulkMigration';
import { autoMapArrays, canMapItems, getFromSchemaItemBgColor, isDisabledSchemaItem } from './utils';

interface MigrationMappingDialogProps {
  isOpen: boolean
  handleClose: () => void
  updateScanMapping: (fromRevSchema: ISchemaItem[], toRevSchema: ISchemaItem[]) => void
  fromRev: DocumentRevision | undefined
  toRev: DocumentRevision | undefined
  scanDetails: IBulkMigrationScanDetails | null
}

const OptionsRenderer: React.FC<{
  name: string | undefined
}> = ({
  name,
}) => {
  const classes = useStyles();
  const {
    getConfiguredSupplierOptions,
  } = useBulkMigration();

  const [optionsToRender, setOptionsToRender] = useState<string[]>([]);

  useEffect(() => {
    if (name) {
      fetchOptions(name);
    }
  }, [name]);

  const fetchOptions = async (name) => {
    const fetchedOptions = await getConfiguredSupplierOptions(name);
    setOptionsToRender((fetchedOptions ?? []).map(option => option.text));
  };

  return optionsToRender?.length ? (
    <span className={classes.mappingDialogSelectionOption}>
      {' - [ '}
      {optionsToRender.join(' | ')}]
    </span>
  ) : null;
};

const MigrationMappingDialog: React.FC<MigrationMappingDialogProps> = ({
  isOpen,
  handleClose,
  updateScanMapping,
  fromRev,
  toRev,
  scanDetails,
}) => {
  const classes = useStyles();
  const [selectedSchemaItem, setSelectedSchemaItem] = useState<ISchemaItem | undefined>();
  const [selectedToSchemaItem, setToSelectedSchemaItem] = useState<ISchemaItem | undefined>();
  const [fromRevSchema, setFromRevSchema] = useState<ISchemaItem[]>([]);
  const [toRevSchema, setToRevSchema] = useState<ISchemaItem[]>([]);
  const [unmappedCount, setUnmappedCount] = useState<number>(0);
  const [isShowRelationVisible, setIsShowRelationVisible] = useState<boolean>(false);
  const [isPreviewPanelVisible, setIsPreviewPanelVisible] = useState<boolean>(false);
  const [isMappingRulesPanelVisible, setIsMappingRulesPanelVisible] = useState<boolean>(false);
  const [isOptionMapperVisible, setIsOptionMapperVisible] = useState<boolean>(false);

  useEffect(() => {
    if (fromRev?.id) {
      let revSchema = fromRev.formTemplate?.schema ?? [];
      revSchema = revSchema.filter((schemaItem) => !schemaItem.deleted && !schemaItem.hidden);
      setFromRevSchema(revSchema);
    }

    if (toRev?.id) {
      let revSchema = toRev.formTemplate?.schema ?? [];
      revSchema = revSchema.filter((schemaItem) => !schemaItem.deleted && !schemaItem.hidden);
      setToRevSchema(revSchema);
    }

    if (scanDetails?.id) {
      if (
        scanDetails.fromFormSchema
        && Array.isArray(scanDetails.fromFormSchema)
        && scanDetails.toFormSchema
        && Array.isArray(scanDetails.toFormSchema)
      ) {
        setFromRevSchema(scanDetails.fromFormSchema);
        setToRevSchema(scanDetails.toFormSchema);
      }
    }
  }, [fromRev, toRev, scanDetails]);

  useEffect(() => {
    if (fromRevSchema?.length) {
      const unmappedItems = fromRevSchema.filter(
        (fromRevSchemaItem) => !fromRevSchemaItem.mappedToCount && !isDisabledSchemaItem(fromRevSchemaItem),
      );
      setUnmappedCount(unmappedItems.length);
    }
  }, [fromRevSchema]);

  const handleMappingSave = () => {
    updateScanMapping(fromRevSchema, toRevSchema);
  };

  const handleMappingPreview = () => {
    setIsPreviewPanelVisible(true);
  };

  const handleClosePreview = () => {
    setIsPreviewPanelVisible(false);
  };

  const handleCloseOptionMapper = () => {
    setIsOptionMapperVisible(false);
  };

  const showMappingRules = () => {
    setIsMappingRulesPanelVisible(true);
  };

  const handleCloseMappingRulesPanel = () => {
    setIsMappingRulesPanelVisible(false);
  };

  const handleAutoMapping = () => {
    // Schema items with the same name or label can be auto mapped.
    const { fromRevSchema: modifiedFromRevSchema, toRevSchema: modifiedToRevSchema } = autoMapArrays(
      fromRevSchema,
      toRevSchema,
    );
    setFromRevSchema([...modifiedFromRevSchema]);
    setToRevSchema([...modifiedToRevSchema]);
  };

  const handleFromSchemaItemClick = (schemaItem: ISchemaItem) => {
    // if (!isDisabledSchemaItem(schemaItem) && !schemaItem.isMapped) {
    if (!isDisabledSchemaItem(schemaItem)) {
      setSelectedSchemaItem(schemaItem);
    }
  };

  const handleRowColumnMapping = (schemaItem: ISchemaItem, tableMappings: IRowData[], entryRemoved?: IMappedFrom) => {
    if (!entryRemoved && !selectedSchemaItem) {
      return;
    }

    setToRevSchema(
      toRevSchema.map((toRevSchemaItem) => {
        if (toRevSchemaItem.name === schemaItem.name) {
          if (!entryRemoved && selectedSchemaItem) {
            if (!toRevSchemaItem.mappedFrom) {
              toRevSchemaItem.mappedFrom = [];
            }
            toRevSchemaItem.mappedFrom.push({
              name: selectedSchemaItem.name!,
              label: selectedSchemaItem.label!,
              isShowDirectly: false,
              type: selectedSchemaItem.type,
            });
          }

          toRevSchemaItem.tableMappings = tableMappings;
        }
        return toRevSchemaItem;
      }),
    );

    if (entryRemoved) {
      handleMappedFromDelete(schemaItem, entryRemoved);
    } else {
      setFromRevSchemaItemMapped(selectedSchemaItem!);
      setSelectedSchemaItem(undefined);
    }
  };

  const handleToSchemaItemClick = (toSchemaItem: ISchemaItem) => {
    if (!selectedSchemaItem) {
      return;
    }

    const { canMap, errMessage, showOptionsMapper } = canMapItems(selectedSchemaItem, toSchemaItem);
    setIsOptionMapperVisible(showOptionsMapper ?? false);
    setToSelectedSchemaItem(showOptionsMapper ? toSchemaItem : undefined);

    if (!canMap && showOptionsMapper) {
      return;
    }

    if (canMap && selectedToSchemaItem) {
      // push into mappedFrom on toRevSchema item to selectedSchemaName.name
      mapSelectedSchemaItemToSchemaItem(toSchemaItem, selectedToSchemaItem);
    } else {
      toastError(errMessage);
    }
  };

  function handleMappingConfirmation (localMapping: {[key: string]: IOption}) {
    // With the localMapping in place, needs to be saved
    mapSelectedSchemaItemToSchemaItem(selectedToSchemaItem!, selectedSchemaItem!, localMapping);

    // Close the dialog
    handleCloseOptionMapper();
  }

  function mapSelectedSchemaItemToSchemaItem (
    toSchemaItem: ISchemaItem,
    selectedSchemaItem: ISchemaItem,
    localMapping?: {[key: string]: IOption},
  ) {
    setToRevSchema(
      toRevSchema.map((toRevSchemaItem) => {
        if (toRevSchemaItem.name === toSchemaItem.name) {
          if (!toRevSchemaItem.mappedFrom) {
            toRevSchemaItem.mappedFrom = [];
          }
          toRevSchemaItem.mappedFrom.push({
            name: selectedSchemaItem.name!,
            label: selectedSchemaItem.label!,
            isShowDirectly: true,
            type: selectedSchemaItem.type,
            localMapping,
          });
        }
        return toRevSchemaItem;
      }),
    );

    // Set isMapped on fromRevSchema item to true
    setFromRevSchemaItemMapped(selectedSchemaItem);
    setSelectedSchemaItem(undefined);
  }

  const handleMappedFromDelete = (schemaItem: ISchemaItem, mappedFromEntryToRemove: IMappedFrom) => {
    setToRevSchema(
      toRevSchema.map((toRevSchemaItem) => {
        if (toRevSchemaItem.name === schemaItem.name) {
          toRevSchemaItem.mappedFrom = toRevSchemaItem.mappedFrom?.filter(
            (mappedFromItem) => mappedFromItem.name !== mappedFromEntryToRemove.name,
          );
        }
        return toRevSchemaItem;
      }),
    );

    setFromRevSchema(
      fromRevSchema.map((fromRevSchemaItem) => {
        if (fromRevSchemaItem.name === mappedFromEntryToRemove.name) {
          if (fromRevSchemaItem.mappedToCount) {
            fromRevSchemaItem.mappedToCount -= 1;
          }
        }
        return fromRevSchemaItem;
      }),
    );
  };

  const setFromRevSchemaItemMapped = (selectedSchemaItem: ISchemaItem) => {
    setFromRevSchema(
      fromRevSchema.map((fromRevSchemaItem) => {
        if (fromRevSchemaItem.name === selectedSchemaItem.name) {
          fromRevSchemaItem.mappedToCount = (fromRevSchemaItem.mappedToCount ?? 0) + 1;
        }
        return fromRevSchemaItem;
      }),
    );
  };

  const showAllSelectOptions = (schemaItem: ISchemaItem) => {
    const options = schemaItem.options?.map((option) => option.value).filter(Boolean);
    return options?.length ? (
      <span className={classes.mappingDialogSelectionOption}>
        {' - [ '}
        {options.join(' | ')}]
      </span>
    ) : null;
  };

  const showMappingIndicator = (mappedFromEntry: IMappedFrom) => {
    if (!mappedFromEntry.localMapping) {
      return <></>;
    }

    const text: string = Object.entries(mappedFromEntry.localMapping).map(
      ([from, to]) => (`<p>${from} -> ${to.text}</p>`),
    ).join(' ');

    return <InfoIndicator text={text} type={IndicatorTypeEnum.INFO} style="white" />;
  };

  const checkIfRequired = (schemaItem: ISchemaItem) => {
    if (!schemaItem.rules) {
      return <></>;
    }

    if (schemaItem.rules?.startsWith('required')) {
      return <span className={classes.isRequired}>*</span>;
    }
  };

  return (
    <Dialog fullScreen open={isOpen} onClose={handleClose} aria-labelledby="migration-mapping-title">
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <Typography variant="h6" className={classes.rulesTitle}>
            {translate('bulk.migration.form.schema.mapping.title')}
          </Typography>
          <Box className={classes.spaceBetweenFlex}>
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={isShowRelationVisible}
                  onChange={(event) => setIsShowRelationVisible(event.target.checked)}
                  color="primary"
                />
              }
              label={translate('bulk.migration.show.mappings')}
              labelPlacement="start"
              className={classes.buttonSpacing}
            />
            <Button
              size="small"
              color="inherit"
              variant="contained"
              onClick={showMappingRules}
              className={classes.buttonSpacing}
            >
              {translate('bulk.migration.rules')}
            </Button>
            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={handleMappingSave}
              className={classes.buttonSpacing}
            >
              {translate('common.save')}
            </Button>
            {Array.isArray(scanDetails?.toFormSchema) && scanDetails?.toFormSchema?.length && (
              <Button size="small" variant="outlined" onClick={handleMappingPreview} className={classes.buttonSpacing}>
                {translate('bulk.migration.preview')}
              </Button>
            )}
            <Button
              size="small"
              color="inherit"
              variant="outlined"
              onClick={handleAutoMapping}
              className={classes.buttonSpacing}
            >
              {translate('bulk.migration.auto.map')}
            </Button>
            <Button size="small" variant="outlined" onClick={handleClose} className={classes.buttonSpacing}>
              {translate('common.close')}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <ul className={classes.mappingDialogInstructions}>
          <li className={classes.compactListItem}>
            Click on a Schema Item on left. A <DoneAllIcon className={classes.doneAllIcon} /> would appear, indicating
            that this is selected.
          </li>
          <li className={classes.compactListItem}>
            Clicking on any item in the <em>To Rev</em> area, maps the two fields together.
          </li>
          <li className={classes.compactListItem}>
            More than one item from the left can be mapped to items on the right.
          </li>
          <li className={classes.compactListItem}>
            Click <b>Save</b> to make the <b>Preview</b> button appear. You can adjust the mapping rules, save, and
            preview as needed until you're satisfied with the results. Once everything looks good, close this screen,
            select the revisions from the table, and click <b>Run Scan</b> to fetch all the eligible revisions for
            selection.
          </li>
        </ul>
        {/* <MappingRules /> */}
        <Typography
          className={classes.mappingInfo}
          variant="subtitle2"
          dangerouslySetInnerHTML={{
            __html: translate('bulk.migration.fields.and.mapping.selection.info', {
              count: unmappedCount,
              length: selectedSchemaItem ? 1 : 0,
            }),
          }}
        />
        <Box className={classes.mappingArea}>
          <ArcherContainer
            strokeColor={Colors.font_gray}
            strokeWidth={0.75}
            className={cx(classes.spaceBetweenFlex, classes.width100)}
          >
            <Box className={classes.fromRevContainer}>
              <Typography variant="h5" className={classes.mappingAreaTitle}>
                {translate('bulk.migration.form.revision', { revision: fromRev?.displayRevision })}
              </Typography>
              <Box className={cx({ [classes.mappingView]: !isShowRelationVisible })}>
                {fromRevSchema
                  .filter((schemaItem) => !schemaItem.deleted)
                  .map((schemaItem) => {
                    return (
                      <ArcherElement id={`from-${schemaItem.name!}`} key={`from-${schemaItem.name!}`}>
                        <Box
                          className={cx(classes.mappingRuleSchemaItemBox, classes.pointer)}
                          style={{ backgroundColor: getFromSchemaItemBgColor(schemaItem) }}
                          onClick={(e) => handleFromSchemaItemClick(schemaItem)}
                        >
                          <Typography variant="body2" color="primary">
                            {schemaItem.label} {checkIfRequired(schemaItem) }
                          </Typography>
                          <Typography variant="caption" display="block" className={classes.capitalize}>
                            {schemaItem.type} {showAllSelectOptions(schemaItem)}
                          </Typography>
                          <Typography variant="caption" display="block">
                            {schemaItem.name}
                          </Typography>
                          {selectedSchemaItem?.name === schemaItem.name && <DoneAllIcon className={classes.selectedFromSchemaItem} />}
                        </Box>
                      </ArcherElement>
                    );
                  })}
              </Box>
            </Box>
            <Box className={classes.toRevContainer}>
              <Typography variant="h5" className={classes.mappingAreaTitle}>
                {translate('bulk.migration.form.revision', { revision: toRev?.displayRevision })}
              </Typography>
              <Box className={cx({ [classes.mappingView]: !isShowRelationVisible })}>
                {toRevSchema
                  .filter((schemaItem) => !schemaItem.deleted)
                  .map((schemaItem) => {
                    return (
                      <ArcherElement
                        id={`to-${schemaItem.name!}`}
                        key={`to-${schemaItem.name}`}
                        relations={
                          isShowRelationVisible
                            ? schemaItem.mappedFrom?.map((mappedFromEntry) => ({
                              targetId: `from-${mappedFromEntry.name}`,
                              targetAnchor: 'right',
                              sourceAnchor: 'left',
                            }))
                            : []
                        }
                      >
                        <Box
                          className={cx(classes.mappingRuleSchemaItemBox, classes.toSchemaItem, {
                            [classes.grey]: isDisabledSchemaItem(schemaItem),
                          })}
                          onClick={() => handleToSchemaItemClick(schemaItem)}
                        >
                          <Box className={classes.width100}>
                            <Box className={classes.simpleFlex}>
                              <Typography variant="body2" color="primary">
                                {schemaItem.label}
                              </Typography>
                              <Typography variant="caption" align="right">
                                {schemaItem.name}
                              </Typography>
                            </Box>
                            <Typography variant="caption" display="block" className={classes.capitalize}>
                              {schemaItem.type}
                              {schemaItem.type !== MigrationSpecialFields.CHECKBOX_GROUP_ASYNC
                                ? showAllSelectOptions(schemaItem) : <OptionsRenderer name= {schemaItem.name} /> }
                            </Typography>
                            {schemaItem.referenceDataType === 'array' && (
                              <ToSchemaItemMappingTable
                                schemaItem={schemaItem}
                                handleMappingChange={(row, entryRemoved) =>
                                  handleRowColumnMapping(schemaItem, row, entryRemoved)
                                }
                                selectedSchemaItem={selectedSchemaItem}
                              />
                            )}
                            {schemaItem.referenceDataType === 'object' && (
                              <ToSchemaItemMappingTable
                                schemaItem={schemaItem}
                                handleMappingChange={(row, entryRemoved) =>
                                  handleRowColumnMapping(schemaItem, row, entryRemoved)
                                }
                                selectedSchemaItem={selectedSchemaItem}
                                isSingleRow
                              />
                            )}
                          </Box>
                          {(schemaItem.mappedFrom ?? []).length > 0
                            && schemaItem.mappedFrom?.map((mappedFromEntry: IMappedFrom) => {
                              const { isShowDirectly, label } = mappedFromEntry;
                              return (
                                isShowDirectly && (
                                  <Chip
                                    icon={showMappingIndicator(mappedFromEntry)}
                                    key={label}
                                    label={label}
                                    onDelete={() => handleMappedFromDelete(schemaItem, mappedFromEntry)}
                                    color="secondary"
                                    className={classes.chip}
                                  />
                                )
                              );
                            })}
                        </Box>
                      </ArcherElement>
                    );
                  })}
              </Box>
            </Box>
          </ArcherContainer>
        </Box>
      </DialogContent>
      {isPreviewPanelVisible && (
        <PreviewDrawer
          isPreviewPanelVisible={isPreviewPanelVisible}
          handleClosePreview={handleClosePreview}
          scanDetails={scanDetails}
          toRevSchema={toRevSchema}
        />
      )}
      {isOptionMapperVisible && (
        <OptionMapperDrawer
          isOptionMapperVisible={isOptionMapperVisible}
          handleCloseOptionMapper={handleCloseOptionMapper}
          handleMappingConfirmation={handleMappingConfirmation}
          selectedSchemaItem={selectedSchemaItem}
          toRevSchemaItem={selectedToSchemaItem}
        />
      )}
      <MappingRulesDrawer isOpen={isMappingRulesPanelVisible} handleClosePanel={handleCloseMappingRulesPanel} />
    </Dialog>
  );
};

export default MigrationMappingDialog;
