import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import { find, get, isEmpty } from 'lodash';
import React, { ChangeEvent } from 'react';
import { translate } from '../../../../../../../common/intl';
import { Dialog } from '../../../../../../components/dialogs';
import {
  Autocomplete,
  FormikField,
} from '../../../../../../components/forms/fields-next';
import { OptionType } from '../../../../../../components/forms/fields/Autocomplete/types';
import {
  Mode,
  MODE_FIELD,
} from '../../../../../../components/KendoDataGrid/constants';
import useDialog from '../../../../../../hooks/useDialog';
import OverflowingContent from '../../../commonCells/OveflowContent';
import {
  EMPTY_DROPDOWN_PLACEHOLDER,
  ON_ORDER_PO_ACTION_COLUMN,
} from '../../constants';
import { CustomTemplateProps, EditableMDItem } from '../../interface';
import { generateDocTitleText } from '../../utils';
import { styles } from './styles';

interface Props extends CustomTemplateProps {
  options: OptionType[]
}

const Editor: React.FC<Props> = ({ field, options }) => {
  const { values, setFieldValue, getFieldProps }
    = useFormikContext<EditableMDItem>();

  const handleChange = (event: ChangeEvent<unknown>, value?: OptionType) => {
    setFieldValue(field, value?.value);
  };

  const value = find(options, { value: values[field] });

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
  const { dataItem, field, onClick, options } = props;
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  if (isEditMode) {
    return <Editor {...props} />;
  }

  const dialog = useDialog();

  const { partDocId, openedPO } = dataItem;
  const isOnOrderPOActionColumn = field === ON_ORDER_PO_ACTION_COLUMN;
  const openedPOsAvailable = openedPO.length > 0;
  const poDocIds = openedPO.map((po) => ({
    docId: po?.document?.docId,
    displayRevision: po.displayRevision,
  }));

  const handleClick = () => onClick?.({ dataItem });
  const handleClickPOs = (e) => {
    dialog.open();
    e.stopPropagation();
  };

  const handleClosePOs = (e) => {
    dialog.close();
    e.stopPropagation();
  };

  const displayValue = find(options, {
    value: get(dataItem, field, EMPTY_DROPDOWN_PLACEHOLDER) as string,
  });

  return (
    <OverflowingContent onClick={handleClick}>
      {translate(displayValue?.label)}
      {isOnOrderPOActionColumn && openedPOsAvailable && (
        <FontAwesomeIcon
          icon={solid('circle')}
          onClick={handleClickPOs}
          className={cx(classes.dot, classes.poPreviewDot)}
        />
      )}
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
    </OverflowingContent>
  );
};
