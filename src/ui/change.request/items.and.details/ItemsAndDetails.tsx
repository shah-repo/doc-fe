import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Divider, Grid, Typography } from '@material-ui/core';
import cx from 'classnames';
import { isEmpty, some } from 'lodash';
import { useObserver } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AutoSizer } from 'react-virtualized';
import { translate } from '../../../common/intl';
import { ChangeRequest } from '../../../state/ducks/changeRequest/types';
import { documentRevisionsSelectors } from '../../../state/ducks/documentRevisions';
import { ApplicationState } from '../../../state/reducers';
import { Button } from '../../components/forms/fields-next';
import { useFormContext } from '../../components/forms/FormContext';
import Text from '../../components/Text';
import { FBFormState } from '../../form.builder';
import ApprovalRequestEditGridItem from './ApprovalRequestEditGridItem';
import useStyles from './ApprovalRequestGrid.styles';
import ApprovalRequestGridHeader from './ApprovalRequestGridHeader';
import ApprovalRequestItem from './ApprovalRequestItem';
import ItemsAndDetailsState from './ItemsAndDetails.state';
import { ApprovalRequestGridItem, FBDocumentRevisionsValue } from './ItemsAndDetails.types';

const Loader = () => {
  const classes = useStyles();

  return (
    <div
      data-cy="ar-items-loader"
      className={classes.loader}
    >
      <Text translation="common.loading" />
    </div>
  );
};

const TopSection: React.FunctionComponent<{
  isButtonShown?: boolean
  showEditRow: () => void
}> = ({
  isButtonShown = true,
  showEditRow,
}) => {
  const classes = useStyles();

  return (
    <>
      <Grid container justify="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h6" id="sectionTitle" component="div" className={classes.title}>
            <Text translation="approvalRequest.items.section.heading" />
          </Typography>
        </Grid>

        <Grid item>
          <Typography>
            <Button
              kind="ghost"
              size="small"
              startIcon={<FontAwesomeIcon icon={solid('circle-plus')} />}
              onClick={isButtonShown ? showEditRow : undefined}
              data-cy="approvalRequest.items.button.addText"
              disabled={!isButtonShown}
            >
              {translate('approvalRequest.items.button.addText')}
            </Button>
          </Typography>
        </Grid>
      </Grid>
      <Divider className={classes.divider} />
    </>
  );
};

interface Props {
  changeRequest?: ChangeRequest
  formState: FBFormState
  handleAdd: () => void
  handleRemove: (docRevId: string) => void
  handleUpdate: () => void
  itemsAndDetailsState: ItemsAndDetailsState
  itemToAdd?: string
}

const ItemsAndDetails: React.FC<Props> = ({
  changeRequest,
  formState,
  handleAdd,
  handleRemove,
  handleUpdate,
  itemsAndDetailsState,
  itemToAdd,
}) => {
  const classes = useStyles();
  const [isEditRowVisible, setIsEditRowVisible] = useState(false);
  const { isEditing } = useFormContext();

  const documentRevision = useSelector(
    (state: ApplicationState) => documentRevisionsSelectors.getDocumentRevision(state, itemsAndDetailsState.approvalRequstItemInEditMode),
  );

  useEffect(() => {
    if (itemToAdd !== '') {
      formState.setFieldValue(
        'proposedDocumentRevision',
        { id: itemToAdd },
      );
      showEditRow();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemToAdd]);

  const showEditRow = () => {
    setIsEditRowVisible(true);
    itemsAndDetailsState.setViewItemActionsVisibility(false);
    if (itemToAdd === '') {
      removePrePopulatedField();
    }
  };

  function disabledOptions (): string[] {
    return itemsAndDetailsState?.approvalRequestItemsList.map(item => item.docRevId);
  }

  function resetAndCancelEdit () {
    // remove values for formState for keys
    removePrePopulatedField();

    setIsEditRowVisible(false);
    itemsAndDetailsState.setViewItemActionsVisibility(true);
  }

  const removePrePopulatedField = () => {
    const removeKeys = ['proposedDocumentRevision', 'descriptionOfChange', 'justificationOfChange', 'autoUpdate'];
    removeKeys.forEach((item) => {
      formState.setFieldValue(item, undefined);
    });
  };

  function addRevisionToChangeRequest () {
    const { proposedDocumentRevision, justificationOfChange, descriptionOfChange }
      = formState?.getValues() as FBDocumentRevisionsValue;

    if (some([justificationOfChange, descriptionOfChange, proposedDocumentRevision], isEmpty)) {
      return;
    }

    setIsEditRowVisible(false);
    handleAdd();
  }

  return useObserver(() => (
    <div className={cx(classes.tabContent, { [classes.tabContentInactive]: itemsAndDetailsState.loadingState })}>
      {itemsAndDetailsState.loadingState && <Loader />}
      <TopSection
        showEditRow={showEditRow}
        isButtonShown={itemsAndDetailsState.viewItemActionsVisible && !isEditing}
      />
      <AutoSizer disableHeight>
        {({ width }) => (
          <div className={cx(classes.tableContainer, 'containing-box-scrollbar')} style={{ width }}>
            <div
              className={cx(
                classes.table,
                {
                  [classes.tableWithSubstitution]: changeRequest?.isLineItemPartCanBeSubstituted,
                },
              )}
            >
              <ApprovalRequestGridHeader
                isLineItemPartCanBeSubstituted={changeRequest?.isLineItemPartCanBeSubstituted}
              />
              <div className={classes.tableContent}>
                {isEditRowVisible && (
                  <ApprovalRequestEditGridItem
                    {...{ formState }}
                    disabledOptions={disabledOptions()}
                    addRevisionToChangeRequest={addRevisionToChangeRequest}
                    resetAndCancelEdit={resetAndCancelEdit}
                    isLineItemPartCanBeSubstituted={changeRequest?.isLineItemPartCanBeSubstituted}
                    documentRevision={documentRevision}
                    isAddingNewItem
                  />
                )}
                {itemsAndDetailsState.approvalRequestItemsList.map((entry: ApprovalRequestGridItem) => (
                  <ApprovalRequestItem
                    {...{ formState }}
                    key={`fb-document-revision-${entry.id}`}
                    entry={entry}
                    revision={documentRevision?.revision}
                    disabledOptions={disabledOptions}
                    handleRemove={handleRemove}
                    handleUpdate={handleUpdate}
                    viewItemActionsVisible={itemsAndDetailsState.viewItemActionsVisible}
                    itemsAndDetailsState={itemsAndDetailsState}
                    isLineItemPartCanBeSubstituted={changeRequest?.isLineItemPartCanBeSubstituted}
                    isDeletionDisabled={isEditing}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </AutoSizer>
    </div>
  ));
};

export default ItemsAndDetails;
