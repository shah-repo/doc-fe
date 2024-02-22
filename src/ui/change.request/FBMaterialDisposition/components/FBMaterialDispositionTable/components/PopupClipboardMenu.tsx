import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ListItemIcon, Menu, MenuList, makeStyles } from '@material-ui/core';
import { ColumnMenuProps } from '@progress/kendo-react-data-tools';
import React, { useRef } from 'react';
import { StyledMenuListItemText } from '../../../../../../App/Shifamed/Components/forms/presenters/StyledMenuListITemText';
import { StyledMenuListItem } from '../../../../../../App/Shifamed/Components/forms/presenters/StyledMenuListItem';
import { ReactComponent as CloneIcon } from '../../../../../../assets/images/clone.svg';
import Text from '../../../../../components/Text';
import { Dialog } from '../../../../../hooks/useDialog';

interface PopupClipboardMenuProps extends ColumnMenuProps {
  copyClipboardPopupMenu: Dialog
  populateCopiedValue: () => void
  clearContent: () => void
}

interface PopupClipboardMenuContextProps {
  copyClipboardPopupMenu: Dialog
  selectedState: {[id: string]: boolean | number[]}
  copiedItems: {
    [id: string]: string
    value: string
  } | undefined
  containerRef: HTMLDivElement | null
  populateCopiedValue: () => void
  clearContent: () => void
  onUpdateSelectedCell: (value: string) => void
}

export const PopupClipboardMenuContext = React.createContext<PopupClipboardMenuContextProps>({} as PopupClipboardMenuContextProps);

const useStyles = makeStyles((theme) => ({
  popperHolder: {
    marginLeft: theme.spacing(46.25),
  },
}));

export const PopupClipboardMenu: React.ComponentType<PopupClipboardMenuProps> = (props) => {
  const { copyClipboardPopupMenu, populateCopiedValue, clearContent } = props;
  const ref = useRef<HTMLDivElement>(null);
  const classes = useStyles();

  return (
    <>
      <div ref={ref} className={classes.popperHolder} />
      <Menu
        id="clipboard-menu"
        anchorEl={ref.current}
        keepMounted
        open={copyClipboardPopupMenu?.isOpen}
        hideBackdrop
      >
        <MenuList
          autoFocusItem={copyClipboardPopupMenu?.isOpen}
          id="composition-menu"
          aria-labelledby="composition-button"
        >
          <StyledMenuListItem button alignItems="flex-start" onClick={populateCopiedValue}>
            <ListItemIcon><CloneIcon /></ListItemIcon>
            <StyledMenuListItemText
              data-cy="copy-value"
              primary={<Text translation="common.copy.value" />}
            />
          </StyledMenuListItem>
          <StyledMenuListItem button alignItems="flex-start" onClick={copyClipboardPopupMenu?.close}>
            <ListItemIcon>
              <FontAwesomeIcon icon={icon({ name: 'square-dashed', family: 'classic', style: 'light' })} />
            </ListItemIcon>
            <StyledMenuListItemText
              data-cy="deselect"
              primary={<Text translation="common.deselect" />}
            />
          </StyledMenuListItem>
          <StyledMenuListItem button alignItems="flex-start" onClick={clearContent}>
            <ListItemIcon>
              <FontAwesomeIcon icon={icon({ name: 'trash', family: 'classic', style: 'regular' })} />
            </ListItemIcon>
            <StyledMenuListItemText
              data-cy="clear-content"
              primary={<Text translation="common.clear.content" />}
            />
          </StyledMenuListItem>
        </MenuList>
      </Menu>
    </>
  );
};
