import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Tooltip } from '@material-ui/core';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import { find, first, get, has, isEmpty, keys, last, values } from 'lodash';
import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { translate } from '../../../../../../../common/intl';
import {
  MODE_FIELD,
  Mode,
} from '../../../../../../components/KendoDataGrid/constants';
import { Dialog } from '../../../../../../components/dialogs';
import {
  Autocomplete,
  FormikField,
} from '../../../../../../components/forms/fields-next';
import { OptionType } from '../../../../../../components/forms/fields/Autocomplete/types';
import useDialog from '../../../../../../hooks/useDialog';
import useHover from '../../../../../../hooks/useHover';
import OverflowingContent from '../../../commonCells/OveflowContent';
import {
  EMPTY_DROPDOWN_PLACEHOLDER,
  ON_ORDER_PO_ACTION_COLUMN,
} from '../../constants';
import { CustomTemplateProps, EditableMDItem } from '../../types';
import { generateDocTitleText } from '../../utils';
import { PopupClipboardMenu, PopupClipboardMenuContext } from '../PopupClipboardMenu';
import { Selector } from '../Selector';
import { styles } from './styles';

interface Props extends CustomTemplateProps {
  options: OptionType[]
  isColumnEditMode?: boolean
}

const Editor: React.FC<Props> = ({ field, options, dataItem, isColumnEditMode }) => {
  const { values, setFieldValue, getFieldProps }
    = useFormikContext<EditableMDItem>();

  const handleChange = (event: ChangeEvent<unknown>, value?: OptionType) => {
    setFieldValue(field, value?.value);
  };

  const value = find(options, { value: isColumnEditMode ? dataItem[field] : values[field] });

  return (
    <FormikField name={field}>
      <Autocomplete
        {...getFieldProps(field)}
        key={isEmpty(values) ? 'disabled' : 'enabled'}
        blurOnSelect
        options={options}
        onChange={handleChange}
        getOptionLabel={(option: OptionType) => translate(option.label)}
        value={value}
        size="small"
      />
    </FormikField>
  );
};

export const DropDownCellTemplate: React.FC<Props> = (props) => {
  const classes = styles();
  const { dataItem, field, onClick, options, onSelectCell } = props;
  const { copyClipboardPopupMenu, selectedState, copiedItems, populateCopiedValue, clearContent } = useContext(PopupClipboardMenuContext);
  const isColumnEditMode = !isEmpty(copiedItems) && (first(values(copiedItems)) ?? [] as string[]).includes(field);
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]) || isColumnEditMode;
  const showPopup = has(selectedState, dataItem.id) && isColumnEditMode && last(keys(selectedState)) === dataItem.id;

  // if (isEditMode) {
  //   return <Editor {...props} />;
  // }

  const dialog = useDialog();
  const [copyIconRef, isHovered] = useHover<HTMLButtonElement>();

  const { partDocId, openedPO } = dataItem;
  const isOnOrderPOActionColumn = field === ON_ORDER_PO_ACTION_COLUMN;
  const openedPOsAvailable = openedPO.length > 0;
  const poDocIds = openedPO.map((po) => ({
    docId: po?.document?.docId,
    displayRevision: po.displayRevision,
  }));
  const [copiedItem, setCopiedItem] = useState<{
    [id: string]: string
  }>({});

  const handleClick = () => {
    if ((has(copiedItem, dataItem.id) && copiedItem[dataItem.id] === field) || isColumnEditMode) {
      return;
    }
    onClick?.({ dataItem });
  };
  const handleClickPOs = (e) => {
    dialog.open();
    e.stopPropagation();
  };
  dataItem.isSelected = false;
  const handleCopy = (e) => {
    dataItem.isSelected = true;
    setCopiedItem({ [dataItem.id]: field });
    onSelectCell?.(dataItem, field);
    e.stopPropagation();
    e?.preventDefault();
  };

  const handleClosePOs = (e) => {
    dialog.close();
    e.stopPropagation();
  };

  const displayValue = find(options, {
    value: get(dataItem, field, EMPTY_DROPDOWN_PLACEHOLDER) as string,
  });

  useEffect(() => {
    if (isEmpty(copiedItems) && has(copiedItem, dataItem.id)) {
      setCopiedItem({});
    }
  }, [copiedItems]);

  return (<>
    {!isEmpty(copiedItems) && !isEmpty(copiedItem) && <Selector />}
    {(isEditMode || dataItem.isSelected) && (<Editor {...props} {...{ isColumnEditMode }} />)}
    {(!isEditMode && !dataItem.isSelected) && <OverflowingContent onClick={handleClick}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <div>
          {translate(displayValue?.label)}
          {isOnOrderPOActionColumn && openedPOsAvailable && (
            <FontAwesomeIcon
              icon={solid('circle')}
              onClick={handleClickPOs}
              className={cx(classes.dot, classes.poPreviewDot)}
            />
          )}
        </div>
        {dataItem[field] && dataItem[field] !== EMPTY_DROPDOWN_PLACEHOLDER && (
          <span ref={copyIconRef}>
            <Tooltip
              title={translate('common.copy.value')}
              placement="top"
              arrow
            >
              <FontAwesomeIcon
                icon={ isHovered ? solid('copy') : regular('copy')}
                onClick={handleCopy}
                className={classes.copyIcon}
              /></Tooltip>
          </span>)}
      </Box>
      <Dialog
        title={translate(
          'approvalRequest.material.disposition.po.preview.title',
          { partDocId },
        )}
        open={dialog.isOpen}
        onClose={handleClosePOs}
        onConfirm={handleClosePOs}
        confirmLabel="common.close"
      >
        <div className={classes.poPreviewModal}>
          {poDocIds.map(({ docId, displayRevision }) => (
            <div className={classes.poPreviewModalItem}>
              {generateDocTitleText(docId, displayRevision)}
            </div>
          ))}
        </div>
      </Dialog>
    </OverflowingContent>}
    {showPopup && <PopupClipboardMenu {...{ copyClipboardPopupMenu, populateCopiedValue, clearContent }} />}
  </>
  );
};
