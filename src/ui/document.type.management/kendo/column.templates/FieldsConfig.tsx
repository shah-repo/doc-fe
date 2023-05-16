import { GridCellProps } from '@progress/kendo-react-grid';
import { get } from 'lodash';
import React from 'react';
import { useIntl } from 'react-intl';
import { ReactComponent as FieldConfigIcon } from '../../../../assets/images/grid_field_config.svg';
import { DisplayText, TranslatedText } from '../../../components/common/kendo/helpers';
import Tooltip from '../../../components/common/kendo/Tooltip';
import checkIfJSONObject from '../helper';
import { TextareaDialog } from './TextareaDialog';


export const FieldsConfig: React.FunctionComponent<GridCellProps> = ({
  onChange,
  dataItem,
  field,
  rowType,
  colSpan,
  style,
  className,
  columnIndex,

}) => {
  const intl = useIntl();
  const getTranslatedText = (key: string) => intl.formatMessage({ id: key });
  const title = getTranslatedText(TranslatedText[DisplayText.FIELD_CONFIG]);
  const [openForm, setOpenForm] = React.useState(false);
  const openPopUpWindow = () => {
    setOpenForm(true);
  };
  const handleCancelEdit = () => {
    setOpenForm(false);
  };

  const onAddClick = ({ fieldsConfig, syntheticEvent }) => {
    if (!onChange) { return; }
    const fieldConfigValue = checkIfJSONObject(fieldsConfig, title);
    if ((fieldConfigValue && typeof fieldConfigValue === 'object') || (fieldConfigValue === '')) {
      onChange({
        dataIndex: 0,
        dataItem,
        field,
        value: fieldConfigValue,
        syntheticEvent,
      });
      setOpenForm(false);
    }
  };
  const formattedValue = get(dataItem, field || '');
  const isEdit =  dataItem.inEdit;

  if (rowType === 'groupHeader') {
    return null;
  }

  return (
    <>
      <td
        colSpan={colSpan}
        style={style}
        role="gridcell"
        className={className}
        data-grid-col-index={columnIndex}
      >
        <Tooltip
          placement="top"
          data={
            isEdit
              ? getTranslatedText('documenttype.edit.config')
              : getTranslatedText('documenttype.view.config')
          }
          childrenElement={
            <FieldConfigIcon
              style={{ cursor: 'pointer' }}
              onClick={() => {
                openPopUpWindow();
              }}
            />
          }
        />
      </td>
      {openForm && (
        <TextareaDialog
          title={title}
          cancelEdit={handleCancelEdit}
          addClick={onAddClick}
          item={formattedValue}
          isEdit={isEdit}
          fieldName={field}
          openForm={openForm}
        />
      )}
    </>
  );
};
