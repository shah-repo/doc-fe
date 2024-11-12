/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AppBar, Box, Button, Chip, Dialog, DialogContent, IconButton, Toolbar, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import React, { useEffect, useState } from 'react';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import Colors from '../../layout/theme/utils/colors';
import { ISchemaItem } from './interface';
import useStyles from './styles';
import { autoMapArrays, canMapItems, getFromSchemaItemBgColor, isDisabledSchemaItem } from './utils';

const MigrationMappingDialog: React.FC<{
  isOpen: boolean
  handleClose: () => void
  fromRev: DocumentRevision | undefined
  toRev: DocumentRevision | undefined
}> = ({ isOpen, handleClose, fromRev, toRev }) => {
  const classes = useStyles();

  const [selectedSchemaItem, setSelectedSchemaItem] = useState<ISchemaItem>();

  const [fromRevSchema, setFromRevSchema] = useState<ISchemaItem[]>([]);
  const [toRevSchema, setToRevSchema] = useState<ISchemaItem[]>([]);

  const [unmappedCount, setUnmappedCount] = useState<number>(0);

  useEffect(() => {
    if (fromRev?.id) {
      let revSchema = fromRev.formTemplate?.schema ?? [];
      revSchema = revSchema.filter(schemaItem => !schemaItem.deleted && !schemaItem.hidden);
      setFromRevSchema(revSchema);
    }
  }, [fromRev]);

  useEffect(() => {
    if (toRev?.id) {
      let revSchema = toRev.formTemplate?.schema ?? [];
      revSchema = revSchema.filter(schemaItem => !schemaItem.deleted && !schemaItem.hidden);
      setToRevSchema(revSchema);
    }
  }, [toRev]);

  useEffect(() => {
    const unmappedItems = fromRevSchema.filter(fromRevSchemaItem => !fromRevSchemaItem.isMapped && !isDisabledSchemaItem(fromRevSchemaItem));
    setUnmappedCount(unmappedItems.length);
  }, [fromRevSchema]);

  function handleSaveMapping () {
    // Handling mapping save
  }

  function handleAutoMapping () {
    // Schema items with the same name or label can be auto mapped.
    const { fromRevSchema: modifiedFromRevSchema, toRevSchema: modifiedToRevSchema } = autoMapArrays(fromRevSchema, toRevSchema);
    setFromRevSchema([...modifiedFromRevSchema]);
    setToRevSchema([...modifiedToRevSchema]);
  }

  function handleFromSchemaItemClick (schemaItem: ISchemaItem) {
    if (!isDisabledSchemaItem(schemaItem) && !schemaItem.isMapped) {
      setSelectedSchemaItem(schemaItem);
    }
  }

  function handleToSchemaItemClick (toSchemaItem: ISchemaItem) {
    if (!selectedSchemaItem?.name) {
      return;
    }

    if (canMapItems(selectedSchemaItem, toSchemaItem)) {
      // push into mappedFrom on toRevSchema item to selectedSchemaName.name
      if (!selectedSchemaItem.isMapped) {
        setToRevSchema(toRevSchema.map(toRevSchemaItem => {
          if (toRevSchemaItem.name === toSchemaItem.name) {
            if (!toRevSchemaItem.mappedFrom) {
              toRevSchemaItem.mappedFrom = [];
            }
            toRevSchemaItem.mappedFrom.push({ name: selectedSchemaItem.name!, label: selectedSchemaItem.label! });
          }
          return toRevSchemaItem;
        }));
      }

      // Set isMapped on fromRevSchema item to true
      setFromRevSchema(fromRevSchema.map(fromRevSchemaItem => {
        if (fromRevSchemaItem.name === selectedSchemaItem.name) {
          fromRevSchemaItem.isMapped = true;
        }
        return fromRevSchemaItem;
      }));

      setSelectedSchemaItem({});
    }
  }

  function handleMappedFromDelete (schemaItem: ISchemaItem, mappedFromEntryToRemove: {label: any, name: string}) {
    setToRevSchema(toRevSchema.map(toRevSchemaItem => {
      if (toRevSchemaItem.name === schemaItem.name) {
        toRevSchemaItem.mappedFrom
          = toRevSchemaItem.mappedFrom?.filter(mappedFromItem => mappedFromItem.name !== mappedFromEntryToRemove.name);
      }
      return toRevSchemaItem;
    }));

    setFromRevSchema(fromRevSchema.map(fromRevSchemaItem => {
      if (fromRevSchemaItem.name === mappedFromEntryToRemove.name) {
        fromRevSchemaItem.isMapped = false;
      }
      return fromRevSchemaItem;
    }));
  }

  return (
    <Dialog
      fullScreen
      scroll="paper"
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="migration-mapping-title"
    >
      <AppBar style={{ position: 'relative' }}>
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6">
            Migration Mapping Rules
          </Typography>
          <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={handleSaveMapping} color="primary"> Save </Button>
            <Button color="inherit" onClick={handleAutoMapping}> Auto Map </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <ul style={{ marginTop: 0, marginBottom: '24px', paddingLeft: '20px' }}>
          <li className={classes.compactListItem}>Click on a Schema Item on left. A <DoneAllIcon style={{ color: Colors.green, position: 'relative', top: '6px' }} /> would appear, indicating that this is selected.</li>
          <li className={classes.compactListItem}>Now click on any item in the <em>To Rev</em> area. This maps the two fields together.</li>
          <li className={classes.compactListItem}>More than one item from the left can be mapped to items on the right.</li>
          <li className={classes.compactListItem}>There are basic rules governing mapping, based on the type of the item. For eg. A checkbox can be mapped only to a checkbox, & so on. This is to minimize data loss.</li>
        </ul>
        <Typography variant="subtitle2">{unmappedCount} fields unmapped</Typography>
        <Box style={{ display: 'flex', justifyContent: 'space-between' }} >
          <Box style={{ width: '28%' }}>
            <Typography variant="h5" style={{ display: 'inline-block' }}>From Revision</Typography> - {fromRev?.displayRevision}
            {fromRevSchema
              .filter(schemaItem => !schemaItem.deleted)
              .map(schemaItem => {
                return (
                  <Box className={classes.mappingRuleSchemaItemBox}
                    key={`from-${schemaItem.name}`}
                    style={{ backgroundColor: getFromSchemaItemBgColor(schemaItem), cursor: 'pointer' }}
                    onClick={e => handleFromSchemaItemClick(schemaItem)}
                  >
                    <Typography variant="body2" color="primary"> {schemaItem.label} </Typography>
                    <Typography variant="caption" display="block" style={{ textTransform: 'capitalize' }}> {schemaItem.type} </Typography>
                    <Typography variant="caption" display="block"> {schemaItem.name} </Typography>
                    {
                      schemaItem.name === selectedSchemaItem?.name
                        && <DoneAllIcon style={{ color: Colors.green, position: 'absolute', right: '6px', top: '2px' }} />
                    }
                  </Box>
                );
              })}
          </Box>
          <Box style={{ width: '56%' }}>
            <Typography variant="h5" style={{ display: 'inline-block' }}>To Revision</Typography>- {toRev?.displayRevision}
            <Typography variant="subtitle2"> </Typography>
            {toRevSchema
              .filter(schemaItem => !schemaItem.deleted)
              .map(schemaItem => {
                return (
                  <Box className={classes.mappingRuleSchemaItemBox}
                    style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', backgroundColor: isDisabledSchemaItem(schemaItem) ? Colors.hint_gray : '' }}
                    key={`to-${schemaItem.name}`}
                    onClick={e => handleToSchemaItemClick(schemaItem)}
                  >
                    <Box>
                      <Typography variant="body2" color="primary"> {schemaItem.label} </Typography>
                      <Typography variant="caption" display="block" style={{ textTransform: 'capitalize' }}> {schemaItem.type} </Typography>
                      <Typography variant="caption" display="block"> {schemaItem.name} </Typography>
                    </Box>
                    {
                      (schemaItem.mappedFrom ?? []).length > 0
                        && schemaItem.mappedFrom?.map(mappedFromEntry => {
                          return (
                            <Chip
                              label={mappedFromEntry.label}
                              onDelete={e => handleMappedFromDelete(schemaItem, mappedFromEntry)}
                              color="secondary"
                              style={{ padding: '0px 4px', height: '28px' }}
                            />
                          );
                        })
                    }
                  </Box>
                );
              })}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default MigrationMappingDialog;
