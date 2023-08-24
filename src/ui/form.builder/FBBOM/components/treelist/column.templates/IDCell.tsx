import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Link, Tooltip } from '@material-ui/core';
import { useTableKeyboardNavigation } from '@progress/kendo-react-data-tools';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import { Observer } from 'mobx-react';
import React, { ChangeEvent, ComponentType, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { SM } from '../../../../../../App';
import { translate } from '../../../../../../common/intl';
import { documentRevisionsActions, documentRevisionsSelectors } from '../../../../../../state/ducks/documentRevisions';
import { DocumentRevision } from '../../../../../../state/ducks/documentRevisions/types';
import { ApplicationState } from '../../../../../../state/reducers';
import { Autocomplete, FormikField } from '../../../../../components/forms/fields-next';
import { OptionType } from '../../../../../components/forms/fields/Autocomplete/types';
import Text from '../../../../../components/Text';
import useActionCreator from '../../../../../hooks/useActionCreator';
import useAsync from '../../../../../hooks/useAsync';
import { Colors } from '../../../../../layout/theme-next';
import { EditableBOM } from '../../../interface';
import FBBOMDetailDrawer from '../../drawer/AlternateParts';
import DocumentRevisionDrawer from '../../drawer/DocumentRevisionDrawer';
import { ADD_FIELD, SELECTED_PART_KEY_SEPARATOR } from '../constants';
import { isEditBOM } from '../utils';
import { styles } from './styles';
import { CustomTreeListCellProps } from './types';

const IDCell: ComponentType<CustomTreeListCellProps> = ({ hasChildren, ...props }) => {
  const { _documentRevisionFormState } = SM.useStores();
  const { colSpan, id, style, dataItem, field, level } = props;
  const isEditMode = isEditBOM(dataItem);
  const classes = styles({ hasChildren, isEditMode });
  const { getFieldProps, setFieldValue } = useFormikContext<EditableBOM>();
  const navigationAttributes = useTableKeyboardNavigation(props.id);
  const isRevisionAvailable = isEditMode && dataItem?.availableRevisions?.isReleased;
  const onClick = (ev) => {
    props.onExpandChange(ev, dataItem, props.level);
  };

  const [parts, setParts] = React.useState<DocumentRevision[]>([]);

  const fetchAvailablePartsAsync = useAsync({
    onSuccess: (data: DocumentRevision[] = []) => {
      setParts(data);
    },
  });

  const fetchSelectedPartAsync = useAsync({
    onSuccess: (data: any[] = []) => {
      if (data && data.length > 0) {
        const {
          revision, status, name, hasAttachments,
          hasPrimaryAttachment, docId,
        } = data[0];

        setFieldValue('revision', revision);
        setFieldValue('status', status);
        setFieldValue('name', name);
        setFieldValue('hasAttachments', hasAttachments);
        setFieldValue('hasPrimaryAttachment', hasPrimaryAttachment);
        setFieldValue('docId', docId);
      }
    },
  });

  useEffect(() => {
    if (!isEditMode) {
      return;
    }
    fetchAvailablePartsAsync.start(
      fetchAvailablePartsAction,
      fetchAvailablePartsAsync,
    );
  }, []);

  const fetchAvailablePartsAction = useActionCreator(documentRevisionsActions.fetchAvailableParts);
  const fetchSelectedPartsAction = useActionCreator(documentRevisionsActions.fetchBOMBranch);

  const renderOptions = () => {
    return parts.map((part) => ({
      label: renderPartLabel(part),
      value: `${part.id}${SELECTED_PART_KEY_SEPARATOR}${part.document.id}`,
    }));
  };

  const renderPartLabel = (part: DocumentRevision) => {
    return `${part?.document.docId} Rev ${part?.displayRevision} - ${part?.name}`;
  };

  const handleChange = (event: ChangeEvent<unknown>, value?: OptionType) => {
    const docInfo = value?.value.split(SELECTED_PART_KEY_SEPARATOR) ?? [];
    fetchSelectedPartAsync.start(
      fetchSelectedPartsAction,
      docInfo[0],
      docInfo[1],
      fetchSelectedPartAsync,
    );
    if (dataItem[ADD_FIELD]) {
      setFieldValue('childNodeRevId', docInfo[0]);
      setFieldValue('childNodeDocumentId', docInfo[1]);
    } else {
      setFieldValue('newChildNodeRevId', docInfo[0]);
    }
    setFieldValue(ADD_FIELD, dataItem[ADD_FIELD]);
  };

  const openDrawer = () => {
    if (!dataItem.isDisabled) {
      _documentRevisionFormState?.setRefreshBomTree(false);
    }
    setOpenPartsDrawer(true);
  };
  const [openPartsDrawer, setOpenPartsDrawer] = React.useState(false);

  const closeDrawer = () => {
    if (!dataItem.isDisabled) {
      _documentRevisionFormState?.setRefreshBomTree(!_documentRevisionFormState?.refreshBomTree);
    }
    setOpenPartsDrawer(false);
  };

  useEffect(() => {
    if (!isEditMode) {
      return;
    }
    const fieldValue = `${dataItem.id.split(SELECTED_PART_KEY_SEPARATOR)[0]}${SELECTED_PART_KEY_SEPARATOR}${dataItem.documentId}`;
    const value = renderOptions().find((option) => option.value === fieldValue);
    if (value && field) {
      setFieldValue(field, value);
    }
  }, [parts]);

  const replaceDocumentRevision = useSelector((state: ApplicationState) =>
    documentRevisionsSelectors.getDocumentRevision(state, dataItem?.replacesStatus ?? ''),
  );

  const loadDocumentRevision = useActionCreator(documentRevisionsActions.load);
  const loadAction = () =>
    loadDocumentRevision(dataItem?.replacesStatus, '');

  useEffect(() => {
    if (dataItem?.replacesStatus) {
      loadAction();
    }
  }, []);

  const getFieldInfo = () => (
    field && <FormikField
      name={field}
    >
      <Autocomplete
        {...getFieldProps(field)}
        blurOnSelect
        options={renderOptions()}
        placeholder={translate('common.select')}
        getOptionLabel={(option: OptionType) => option.label}
        disabled={isEditMode && isRevisionAvailable}
        onChange={handleChange}
        size="small"
      />
    </FormikField>
  );

  const getInfoIcon = () => (
    <span className={cx('k-icon', classes.infoIcon)}>
      <Tooltip arrow title={translate('bom.revision.available')} placement="top-start">
        <FontAwesomeIcon color={Colors.primaryLight} icon={solid('circle-exclamation')} />
      </Tooltip>
    </span>
  );

  const getDrawer = () => (
    <FBBOMDetailDrawer {...{ openDrawer: openPartsDrawer, closeDrawer, dataItem }} >
      <DocumentRevisionDrawer {...{ dataItem }} />
    </FBBOMDetailDrawer>
  );

  return (
    <td
      className={cx('k-table-td k-text-nowrap', classes.cellborderBottom, props.className)}
      aria-colindex={props.ariaColumnIndex}
      data-grid-col-index={props.colIndex}
      role="gridcell"
      {...navigationAttributes}
      aria-expanded={props.expanded}
      aria-selected="false"
      {...{ colSpan, id, style }}
    >
      {!isEditMode && [...(Array(props.level.length) as number[])].map((e, i) => {
        const availableRevs = dataItem?.availableRevisions;
        if (hasChildren) {
          if (i === props.level.length - 2 && availableRevs?.isReleased) {
            return getInfoIcon();
          }
        } else {
          if (i === props.level.length - 1 && availableRevs?.isReleased) {
            return getInfoIcon();
          }
        }
        if (i === props.level.length - 1 && hasChildren && !dataItem.markAsDeleted) {
          return (<span className={cx('k-icon', classes.expand)}>
            {(props.expanded
              ? <FontAwesomeIcon onClick={onClick} size="sm" icon={regular('square-minus')} />
              : <FontAwesomeIcon onClick={onClick} icon={solid('square-plus')} size="sm" />
            )
            }
          </span>);
        }
        return !isEditMode && <span className="k-icon k-i-none" role="presentation" />;
      })
      }

      <span className={cx(classes.nameCell, classes.titleInfoCell)}>
        {isEditMode && getFieldInfo()}
        {!isEditMode
        && (_documentRevisionFormState?.docId !== dataItem.docId
          ? <Link underline="hover" onClick={openDrawer} className={classes.link}>
            {dataItem.docId}
          </Link>
          : dataItem.docId) }
        {dataItem.isOwner && !isEditMode && <Tooltip
          title={translate('bom.owner')}
          placement="top"
          arrow
        >
          <FontAwesomeIcon className={classes.ownerIcon} icon={solid('user-pen')} />
        </Tooltip>}
        {dataItem.isOwner && !isEditMode && !dataItem.isDisabled && dataItem.status?.toLowerCase() !== 'released' && <Tooltip
          title={translate('bom.add.child.part')}
          placement="top"
          arrow
        >
          <FontAwesomeIcon onClick={() => _documentRevisionFormState?.setChildPartInfo({ dataItem: dataItem, level })} color={Colors.primaryLight } icon={solid('octagon-plus')} className={classes.childePartAddIcon} />
        </Tooltip>}
        {dataItem.markAsDeleted && !dataItem.isDisabled && <Tooltip
          title={translate('common.restore')}
          placement="top"
          arrow
        >
          <FontAwesomeIcon
            className={classes.restoreParentIcon}
            onClick={() => _documentRevisionFormState?.setRestorePartInfo({ dataItem: dataItem, level })}
            icon={solid('arrow-rotate-left')} />
        </Tooltip>}
      </span>
      <Observer>
        {() => (
          <>
            {!isEditMode && _documentRevisionFormState?.showBOMDiff && dataItem?.replacesStatus
            && <Grid
              container
              className={classes.replacedDocRevInfo}
              wrap="nowrap"
              justify="flex-end"
              alignItems="center"
            >
              <span className={classes.replacedDocRevInfoTitle} >{translate('bom.replaced.doc.rev')}</span>&nbsp;
              <FontAwesomeIcon icon={solid('arrow-right')} />&nbsp;{replaceDocumentRevision?.document?.docId}
              <Grid item className={classes.whiteDot} />
              <Grid item>
                <Text
                  translation="form.builder.header.rev"
                  values={{ revision: replaceDocumentRevision?.displayRevision }}
                />
              </Grid>
            </Grid>}
          </>
        )}
      </Observer>
      {getDrawer()}
    </td>
  );
};

export default IDCell;
