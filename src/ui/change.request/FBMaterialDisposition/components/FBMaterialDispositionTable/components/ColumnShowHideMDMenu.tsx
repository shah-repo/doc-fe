import {
  Box,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { useIntl } from 'react-intl';
import { ReactComponent as ViewGridIcon } from '../../../../../../assets/images/grid_view.svg';
import { ReactComponent as SolidIcon } from '../../../../../../assets/images/view.svg';
import { ReactComponent as ViewChecked } from '../../../../../../assets/images/view_checked.svg';
import { ColumnDefinition } from '../../../../../components/KendoDataGrid/KendoDataGrid.types';
import Text from '../../../../../components/Text';
import { StyleTooltip } from '../../../../../dashboard.new/line.items/common/StyleTooltip';
import { EditableMDItem } from '../types';
import { styles } from './ColumnShowHideMDMenu.styles';

interface Props {
  columnDefinition: Array<ColumnDefinition<EditableMDItem>>
  onChange: (colum: ColumnDefinition<EditableMDItem>) => void
}

const ColumnShowHideMDMenu: React.FunctionComponent<Props> = ({
  columnDefinition,
  onChange,
}) => {
  const intl = useIntl();
  const getTranslatedText = (key: string) =>
    key ? intl.formatMessage({ id: key }) : '';
  const classes = styles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);
  return (
    <FormControl variant="outlined">
      <StyleTooltip
        title={<Text translation="common.column" />}
        placement="top"
        arrow
      >
        <IconButton onClick={handleClick} data-cy="manageColumnsBtn">
          <ViewGridIcon className={classes.viewIcon} />
        </IconButton>
      </StyleTooltip>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
      >
        <Card>
          <CardHeader className={classes.headerMenuItem}
            title={
              <Typography
                component="span"
                variant="body2"
                className={classes.columnsCus}
                color="textPrimary"
              >
                <Text translation="common.column" />
              </Typography>
            }
          />
          <CardContent className={classes.box}>
            {columnDefinition.map((item: ColumnDefinition<EditableMDItem>) => (
              <MenuItem
                key={item.title}
                value={item.field as string}
                disabled={item.disabled}
              >
                <ListItemText
                  id={item.field as string}
                  primary={
                    <Typography className={classes.menuItem}>
                      {getTranslatedText(item.title as string).toUpperCase()}
                    </Typography>
                  }
                />
                <Box flexGrow={1} mr={5} />
                {item.show ? (
                  <SolidIcon
                    onClick={() => onChange(item)}
                  />
                ) : (
                  <ViewChecked
                    onClick={() => onChange(item)}
                  />
                )}
              </MenuItem>
            ))}
          </CardContent>
        </Card>
      </Menu>
    </FormControl>
  );
};

export default ColumnShowHideMDMenu;
