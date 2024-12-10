import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Popper } from '@material-ui/core';
import cx from 'classnames';
import React, { useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { translate } from '../../../common/intl';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { Checkbox } from '../../components/forms/fields-next';
import { EMPTY_VALUE_PLACEHOLDER, MODE_FIELD, Mode } from '../../components/KendoDataGrid/constants';
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBForm, FBFormState } from '../../form.builder';
import Actions from '../../form.builder/FBApprovalMatrixRoles/components/Actions';
import useStyles from './ApprovalRequestGrid.styles';
import ARAttachmentsList from './ARAttachmentsList';
import { ApprovalRequestGridItem } from './ItemsAndDetails.types';
import KendoTextEditor from './KendoTextEditor';

interface Props {
  disabledOptions?: string[]
  formState: FBFormState
  addRevisionToChangeRequest: () => void
  resetAndCancelEdit?: () => void
  isAddingNewItem?: boolean
  handleRemove?: (docRevId: string) => void
  entry?: ApprovalRequestGridItem
  isLineItemPartCanBeSubstituted?: boolean
  documentRevision?: DocumentRevision
  isDeletionDisabled?: boolean
}

const ApprovalRequestEditGridItem: React.FC<Props> = ({
  disabledOptions = [],
  formState,
  addRevisionToChangeRequest,
  resetAndCancelEdit,
  isAddingNewItem,
  handleRemove,
  isLineItemPartCanBeSubstituted,
  entry,
  documentRevision,
  isDeletionDisabled,
}) => {
  const classes = useStyles();
  const location = useLocation();
  console.log({ entryDocRevId: entry?.docRevId, locationPathname: location.pathname, pathnameIncludesDocRevId: location.pathname.includes(entry?.docRevId), isDeletionDisabled });

  const showDeleteButton = Boolean(entry?.docRevId) && !location.pathname.includes(entry?.docRevId);
  const [autoUpdateChecked, setAutoUpdateChecked] = useState(entry?.autoUpdate);
  const popperAnchorRef = useRef<HTMLDivElement>(null);

  const isWhereUsedTreeExist = (entry?.whereUsedView ?? []).length > 1;

  return (
    <FBForm {...{ formState }} >
      <div
        className={classes.enclosingDiv}
        data-cy="enclosing-div-edit-item"
      >
        <div
          className={cx(classes.contentRow, classes.editedContentRow)}
          data-cy="ar-item-edit-row"
        >
          {isLineItemPartCanBeSubstituted && (
            <div className={cx(classes.contentCell, classes.autoUpdateCell)}>
              <Checkbox
                checked={autoUpdateChecked}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setAutoUpdateChecked(event.target.checked);
                  formState.setFieldValue('autoUpdate', event.target.checked);
                }}
                name="autoUpdate"
              />
            </div>
          )}
          <div
            className={cx(
              classes.contentCell,
              classes.itemCell,
              {
                [classes.wideItemCell]: isAddingNewItem,
              },
            )}
          >
            {isAddingNewItem ? (
              <FBAutocompleteAsync
                name="proposedDocumentRevision"
                label="form.builder.document"
                placeholder="form.builder.select"
                optionId={FBAutocompleteAsyncOption.DRAFTdocumentRevisions}
                optionValueType="id"
                rules="required"
                disabledOptions={disabledOptions}
                shouldReloadOnInit
                autoCompleteClasses={{ option: classes.autocompleteOption }}
              />
            ) : (
              <span>{entry?.titleText}</span>
            )}
          </div>
          {!isAddingNewItem && (
            <>
              <div className={classes.contentCell}>
                {entry?.revisionFormTo ?? documentRevision?.revision ?? EMPTY_VALUE_PLACEHOLDER}
              </div>
              <div className={classes.contentCell}>
                {entry?.attachments ? (
                  <ARAttachmentsList
                    attachments={entry?.attachments}
                    titleId={entry?.titleText}
                  />
                ) : (
                  EMPTY_VALUE_PLACEHOLDER
                )}
              </div>
            </>
          )}
          <div
            className={cx(
              classes.contentCell,
              classes.textCell,
              classes.textCellEditing,
              {
                [classes.textCellAdding]: isAddingNewItem,
              },
            )}
          >
            <KendoTextEditor
              name="descriptionOfChange"
              label="form.builder.description.of.change"
              placeholder="form.builder.enter"
              rules="required"
            />
          </div>
          <div
            className={cx(
              classes.contentCell,
              classes.textCell,
              classes.textCellEditing,
              {
                [classes.textCellAdding]: isAddingNewItem,
              },
            )}
          >
            <KendoTextEditor
              name="justificationOfChange"
              label="form.builder.justification.of.change"
              placeholder="form.builder.enter"
              rules="required"
            />
          </div>
          <div
            className={cx(classes.contentCell, classes.whereUsedCell)} data-cy="edit-where-used"
          >
            <FontAwesomeIcon
              icon={isWhereUsedTreeExist ? solid('circle') : regular('circle')}
              data-cy="view-where-used"
              className={cx(classes.whereUsedIcon, classes.iconDisabled)}
            />
          </div>
        </div>
      </div>
      <div className={classes.actionsRow}>
        <div ref={popperAnchorRef} className={classes.actionsAnchor} />
        {popperAnchorRef.current && (
          <Popper
            open
            placement="bottom-end"
            anchorEl={popperAnchorRef.current}
            className={classes.popper}
            modifiers={{
              keepTogether: {
                enabled: true,
              },
              preventOverflow: {
                enabled: false,
              },
              hide: {
                enabled: false,
              },
            }}
          >
            <Actions
              scrollBehavior="smooth"
              isDeleteDisabled={isDeletionDisabled}
              deleteTooltipText={isDeletionDisabled ? translate('form.builder.delete.disabled') : undefined}
              dataItem={{ [MODE_FIELD]: Mode.add }}
              customDataCy={{
                confirm: 'done-record',
                discard: 'clear-record',
                delete: 'delete-record',
              }}
              onConfirm={addRevisionToChangeRequest}
              onDiscard={resetAndCancelEdit}
              onDelete={showDeleteButton ? () => {
                resetAndCancelEdit?.();
                handleRemove?.(entry?.docRevId as string);
              } : undefined}
            />
          </Popper>
        )}
      </div>
    </FBForm>
  );
};

export default ApprovalRequestEditGridItem;
