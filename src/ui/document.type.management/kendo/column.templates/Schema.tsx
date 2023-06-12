import { GridCellProps } from '@progress/kendo-react-grid';
import { get } from 'lodash';
import React from 'react';
import { useIntl } from 'react-intl';
import { ReactComponent as SchemaIcon } from '../../../../assets/images/grid_schema.svg';
import { DisplayText, TranslatedText } from '../../../components/common/kendo/helpers';
import Tooltip from '../../../components/common/kendo/Tooltip';
import checkIfJSONObject from '../helper';
import { TextareaDialog } from './TextareaDialog';

export const Schema: React.FunctionComponent<GridCellProps> = ({
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
  const title = getTranslatedText(TranslatedText[DisplayText.SCHEMA]);
  const [openForm, setOpenForm] = React.useState(false);
  const openSchemaWindow = () => {
    setOpenForm(true);
  };
  const handleCancelEdit = () => {
    setOpenForm(false);
  };


  const onAddClick = ({ schema, syntheticEvent }) => {
    if (!onChange) { return; }
    const schemaValue = checkIfJSONObject(schema, title);
    if ((schemaValue && typeof schemaValue === 'object') || (schemaValue === '')) {
      onChange({
        dataIndex: 0,
        dataItem,
        field,
        value: schemaValue,
        syntheticEvent,
      });
      setOpenForm(false);
    }
  };

  const formattedValue = get(dataItem, field || '');
  const isEdit = dataItem.inEdit;
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
              ? getTranslatedText('documenttype.edit.schema')
              : getTranslatedText('documenttype.view.schema')
          }
          childrenElement={
            <SchemaIcon
              style={{ cursor: 'pointer' }}
              onClick={() => {
                openSchemaWindow();
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
