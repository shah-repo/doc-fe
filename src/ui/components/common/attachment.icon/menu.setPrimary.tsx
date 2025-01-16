import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Theme } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import { createStyles, makeStyles } from '@material-ui/styles';
import React from 'react';
import { LINE_TYPES } from '../../../../state/ducks/attachments/constants';
import { documentRevisionsActions } from '../../../../state/ducks/documentRevisions';
import { DocumentRevision, DocumentRevisionStatus } from '../../../../state/ducks/documentRevisions/types';
import { FormHeaderContext } from '../../../documentRevision/forms/DocumentRevisionForm.container';
import { isDocumentRevisionInStatus } from '../../../documentRevision/helpers/documentRevisionStatus';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import { Colors } from '../../../layout/theme-next';
import { toastError } from '../../notifications';
import Text from '../../Text';

const styles = makeStyles((theme: Theme) =>
  createStyles({
    starIcon: {
      color: Colors.primary,
      height: 16,
      width: 16,
      marginRight: theme.spacing(2),
    },
  }));

interface Props {
  handleClose?: any
  attachment: any
  documentRevision?: DocumentRevision
}

const MenuItemSetPrimary: React.FunctionComponent<Props> = ({
  handleClose,
  attachment = {},
  documentRevision,
}) => {
  const classes = styles();
  const setAsPrimaryAction = useActionCreator(documentRevisionsActions.setPrimaryAttachment);
  const setAsPrimaryAsync = useAsync({
    onError: (error) => toastError(error as string),
  });
  const isDocumentPage = Boolean(React.useContext(FormHeaderContext));

  if (!isDocumentPage) {
    return null;
  }
  if (attachment.id === documentRevision?.primaryAttachment?.id) {
    return null;
  }

  const isNewDocument = isDocumentPage && !documentRevision?.id;
  const canSetAsPrimary = isDocumentRevisionInStatus(
    [DocumentRevisionStatus.Draft, DocumentRevisionStatus.PendingChange],
    documentRevision?.status,
  ) && documentRevision?.document?.canAccess && attachment.lineType !== LINE_TYPES.RED_LINE;

  if (!canSetAsPrimary || isNewDocument) {
    return null;
  }

  const handleClick = () => {
    setAsPrimaryAsync.start(setAsPrimaryAction, documentRevision?.id, attachment.id, setAsPrimaryAsync);
    handleClose?.();
  };

  return (
    <MenuItem data-cy="set.attachment.as.primary" onClick={handleClick}>
      <FontAwesomeIcon icon={solid('circle-star')} className={classes.starIcon} />
      <Text translation="attachment.set.as.primary" />
    </MenuItem>
  );
};

export default MenuItemSetPrimary;
