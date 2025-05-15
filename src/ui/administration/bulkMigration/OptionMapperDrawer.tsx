import { Box, Button, DialogActions, Drawer, List, ListItem, ListItemText, Paper, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { translate } from '../../../common/intl';
import { MigrationSpecialFields } from '../../documentRevision/forms/presenters/change.document.form/utils/constants';
import CurrentMappings from './CurrentMappings';
import DialogHeader from './DrawerHeader';
import { FormFieldSchema, ListType, LocalMappingOption, MappingOptions } from './interface';
import useStyles from './styles';
import { useBulkMigration } from './useBulkMigration';

interface OptionMapperDrawerProps {
  isOptionMapperVisible: boolean
  handleCloseOptionMapper: () => void
  handleMappingConfirmation: (localMapping: LocalMappingOption) => void
  selectedSchemaItem?: FormFieldSchema
  toRevSchemaItem?: FormFieldSchema
}

const OptionMapperDrawer: React.FC<OptionMapperDrawerProps> = ({
  isOptionMapperVisible,
  handleCloseOptionMapper,
  handleMappingConfirmation,
  selectedSchemaItem,
  toRevSchemaItem,
}) => {
  const classes = useStyles();
  const { getConfiguredSupplierOptions } = useBulkMigration();
  const [checkboxFromOptions, setCheckboxFromOptions] = useState<MappingOptions[]>([]);
  const [checkboxToOptions, setCheckboxToOptions] = useState<MappingOptions[]>([]);
  const [fromSelectedOption, setFromSelectedOption] = useState<MappingOptions | undefined>();
  const [localMapping, setLocalMapping] = useState<LocalMappingOption>({});

  useEffect(() => {
    if (toRevSchemaItem?.type === MigrationSpecialFields.CHECKBOX_GROUP_ASYNC && toRevSchemaItem?.name) {
      fetchOptions(toRevSchemaItem?.name);
    }
  }, [toRevSchemaItem]);

  const fetchOptions = async (name: string) => {
    const fetchedOptions = await getConfiguredSupplierOptions(name);
    setCheckboxToOptions(
      (fetchedOptions ?? []).map((option: MappingOptions) => ({ text: option.text, value: option.text })),
    );
  };

  useEffect(() => {
    if (selectedSchemaItem) {
      setCheckboxFromOptions((selectedSchemaItem.options as MappingOptions[]) ?? []);
    }

    if (toRevSchemaItem) {
      setCheckboxToOptions((toRevSchemaItem.options as MappingOptions[]) ?? []);
    }
  }, [selectedSchemaItem, toRevSchemaItem]);

  const handleFromOptionClick = (option: MappingOptions) => {
    setFromSelectedOption(option);
  };

  const handleToOptionClick = (option: MappingOptions) => {
    if (!fromSelectedOption) {
      return;
    }

    const newMapping = { ...localMapping, [fromSelectedOption?.text]: option };
    setLocalMapping(newMapping);
    setFromSelectedOption(undefined);
  };

  const isFromOptionMapped = (option: MappingOptions) => {
    return Object.keys(localMapping).includes(option.text);
  };

  const isToOptionMapped = (option: MappingOptions) => {
    return Object.values(localMapping)
      .map((option) => option.text)
      .includes(option.text);
  };

  const getItemStyle = (option: MappingOptions, listType: string) => {
    if (listType === ListType.FROM) {
      if (fromSelectedOption?.text === option.text) {
        return classes.optionMapperDrawerSelectedListItem;
      }
      if (isFromOptionMapped(option)) {
        return classes.optionMapperDrawerMappedListItem;
      }
    }

    if (listType === ListType.TO) {
      if (isToOptionMapped(option)) {
        return classes.optionMapperDrawerMappedListItem;
      }
    }
  };

  return (
    <Drawer
      anchor="left"
      open={isOptionMapperVisible}
      onClose={handleCloseOptionMapper}
      classes={{ paper: classes.previewDrawerDialogPaper }}
    >
      <Box className={classes.previewDrawerDialog}>
        <Box className={classes.optionMapperContent}>
          <DialogHeader title={translate('bulk.migration.mapping.options')} onDialogClose={handleCloseOptionMapper} />

          <Box className={classes.optionMapperDrawerListContainer}>
            {/* First List of Options */}
            <Paper className={classes.optionMapperDrawerOptionsList}>
              <List>
                <Typography
                  variant="subtitle1"
                  align="center"
                  dangerouslySetInnerHTML={{
                    __html: translate('bulk.migration.mapping.from.title', {
                      label: selectedSchemaItem?.label as string,
                    }),
                  }}
                />
                {checkboxFromOptions.map((option, index) => (
                  <ListItem
                    button
                    key={option.text}
                    onClick={() => handleFromOptionClick(option)}
                    className={getItemStyle(option, ListType.FROM)}
                  >
                    <ListItemText primary={option.text} />
                  </ListItem>
                ))}
              </List>
            </Paper>

            <Paper className={classes.optionMapperDrawerOptionsList}>
              <List>
                <Typography
                  variant="subtitle1"
                  align="center"
                  dangerouslySetInnerHTML={{
                    __html: translate('bulk.migration.mapping.to.title', {
                      label: toRevSchemaItem?.label as string,
                    }),
                  }}
                />
                {checkboxToOptions.map((option, index) => (
                  <ListItem
                    button
                    key={option.text}
                    onClick={() => handleToOptionClick(option)}
                    className={getItemStyle(option, ListType.TO)}
                  >
                    <ListItemText primary={option.text} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>

          <CurrentMappings localMapping={localMapping} />
        </Box>

        <DialogActions className={classes.spaceBetweenFlex}>
          <Button onClick={handleCloseOptionMapper} color="inherit" variant="contained">
            {translate('common.cancel')}
          </Button>
          {Object.entries(localMapping).length > 0 && (
            <Button
              onClick={() => handleMappingConfirmation(localMapping)}
              color="primary"
              variant="contained"
              autoFocus
            >
              {translate('common.confirm')}
            </Button>
          )}
        </DialogActions>
      </Box>
    </Drawer>
  );
};

export default OptionMapperDrawer;
