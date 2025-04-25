import { Box, Button, DialogActions, Drawer, List, ListItem, ListItemText, Paper, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { translate } from '../../../common/intl';
import CurrentMappings from './CurrentMappings';
import DialogHeader from './DrawerHeader';
import { IOption, ISchemaItem } from './interface';
import useStyles from './styles';

interface OptionMapperDrawerProps {
  isOptionMapperVisible: boolean
  handleCloseOptionMapper: () => void
  handleMappingConfirmation: (localMapping: {[key: string]: IOption}) => void
  selectedSchemaItem: ISchemaItem | undefined
  toRevSchemaItem: ISchemaItem | undefined
}

const OptionMapperDrawer: React.FC<OptionMapperDrawerProps> = ({
  isOptionMapperVisible,
  handleCloseOptionMapper,
  handleMappingConfirmation,
  selectedSchemaItem,
  toRevSchemaItem,
}) => {
  const classes = useStyles();

  const [checkboxFromOptions, setCheckboxFromOptions] = useState<IOption[]>([]);
  const [checkboxToOptions, setCheckboxToOptions] = useState<IOption[]>([]);

  const [fromSelectedOption, setFromSelectedOption] = useState<IOption | undefined>();
  const [localMapping, setLocalMapping] = useState<{[key: string]: IOption}>({});

  useEffect(() => {
    if (selectedSchemaItem) {
      setCheckboxFromOptions((selectedSchemaItem.options as unknown as IOption[]) ?? []);
    }

    if (toRevSchemaItem) {
      setCheckboxToOptions((toRevSchemaItem.options as unknown as IOption[]) ?? []);
    }
  }, [selectedSchemaItem, toRevSchemaItem]);

  const handleFromOptionClick = (option) => {
    setFromSelectedOption(option);
  };

  const handleToOptionClick = (option: IOption) => {
    if (!fromSelectedOption) {
      return;
    }

    const newMapping = { ...localMapping, [fromSelectedOption?.text]: option };
    setLocalMapping(newMapping);
    setFromSelectedOption(undefined);
  };

  const isFromOptionMapped = (option: IOption) => {
    return Object.keys(localMapping).includes(option.text);
  };

  const isToOptionMapped = (option: IOption) => {
    return Object.values(localMapping).map(option => option.text).includes(option.text);
  };

  const getItemStyle = (option: IOption, listType: string) => {
    if (listType === 'from') {
      if (fromSelectedOption?.text === option.text) {
        return classes.optionMapperDrawerSelectedListItem;
      }
      if (isFromOptionMapped(option)) {
        return classes.optionMapperDrawerMappedListItem;
      }
    }

    if (listType === 'to') {
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
                <Typography variant="subtitle1" align="center"
                  dangerouslySetInnerHTML={{
                    __html: translate('bulk.migration.mapping.from.title', {
                      label: selectedSchemaItem?.label as string,
                    }),
                  }}
                />
                {checkboxFromOptions.map((option, index) => (
                  <ListItem button key={option.text}
                    onClick={() => handleFromOptionClick(option)}
                    className={getItemStyle(option, 'from')}
                  >
                    <ListItemText primary={option.text} />
                  </ListItem>
                ))}
              </List>
            </Paper>

            <Paper className={classes.optionMapperDrawerOptionsList}>
              <List>
                <Typography variant="subtitle1" align="center"
                  dangerouslySetInnerHTML={{
                    __html: translate('bulk.migration.mapping.to.title', {
                      label: toRevSchemaItem?.label as string,
                    }),
                  }}
                />
                {checkboxToOptions.map((option, index) => (
                  <ListItem button key={option.text}
                    onClick={() => handleToOptionClick(option)}
                    className={getItemStyle(option, 'to')}
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
            <Button onClick={e => handleMappingConfirmation(localMapping)} color="primary" variant="contained" autoFocus>
              {translate('common.confirm')}
            </Button>
          )}
        </DialogActions>
      </Box>
    </Drawer>
  );
};

export default OptionMapperDrawer;
