import {
  Box,
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
import Text from '../../../../../components/Text';
import { StyleTooltip } from '../../../../../dashboard.new/line.items/common/StyleTooltip';
import { CustomTreeListColumnProps } from '../constants';
import { styles } from './styles';

interface Props {
  columnDefinition: CustomTreeListColumnProps[]
  onChange: (colum: CustomTreeListColumnProps) => void
}

const ColumnShowHideTreeMenu: React.FunctionComponent<Props> = ({
  columnDefinition,
  onChange,
}) => {
  const intl = useIntl();
  const getTranslatedText = (key: string) =>
    key ? intl.formatMessage({ id: key }) : '';
  const classes = styles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <FormControl variant="outlined">
      <StyleTooltip
        title={<Text translation="common.column" />}
        placement="top"
        arrow
      >
        <IconButton onClick={handleClick} data-cy="manageColumnsBtn">
          <ViewGridIcon />
        </IconButton>
      </StyleTooltip>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
      >
        <MenuItem className={classes.headerMenuItem}>
          <ListItemText
            primary={
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
        </MenuItem>
        {columnDefinition.map((item: CustomTreeListColumnProps) => (
          <MenuItem
            key={item.title}
            value={item.field}
            disabled={item.disableShowOrHideSelection}
          >
            <ListItemText
              id={item.field}
              primary={
                <Typography className={classes.menuItem}>
                  {getTranslatedText(item.title ?? '').toUpperCase()}
                </Typography>
              }
            />
            <Box flexGrow={1} mr={5} />
            {item.hidden ? (
              <ViewChecked
                onClick={() => {
                  onChange(item);
                }}
              />
            ) : (
              <SolidIcon
                onClick={() => {
                  onChange(item);
                }}
              />

            )}
          </MenuItem>
        ))}
      </Menu>
    </FormControl>
  );
};

export default ColumnShowHideTreeMenu;
