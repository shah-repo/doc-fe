import {
  Box,
  CircularProgress,
  Popper,
  TextField,
} from '@material-ui/core';
import Autocomplete, { RenderInputParams } from '@material-ui/lab/Autocomplete';
import { useFormikContext } from 'formik';
import { isEmpty, kebabCase } from 'lodash';
import React, { MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { translate } from '../../../../common/intl';
import { FormikField } from '../../../components/forms/fields-next';
import { OptionType } from '../../../components/forms/fields/Autocomplete/types';
import { Mode, MODE_FIELD } from '../../../components/KendoDataGrid/constants';
import OverflowTooltip from '../../../components/OverflowTooltip';
import { documentVersionPath } from '../../../document.revision/utils/paths';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';
import { CustomTemplateProps, EditableShippingItem, PartOption } from '../types';

interface Props extends CustomTemplateProps {
  loading: boolean
  options: PartOption[]
}

interface CustomOptionType extends OptionType {
  revision: string
  docId: string
  documentId: string
}

const Editor: React.FC<Props> = ({ dataItem, field, options, loading }) => {
  const { values, setFieldValue } = useFormikContext<EditableShippingItem>();
  const isUpdateAction = Mode.edit === dataItem[MODE_FIELD];

  const onChange = (event: React.ChangeEvent<{}>, value: CustomOptionType) => {
    setFieldValue(field, { id: value?.value, name: `${value?.docId}.${value.revision}`, documentId: value?.documentId });
  };

  const renderOptions = (): CustomOptionType[] => {
    return options.map((item) => ({
      label: translate('form.builder.shipping.items.label',
        {
          docId: item.document?.docId,
          displayRevision: item?.displayRevision,
          name: item?.name,
        }),
      docId: item.document?.docId,
      revision: item?.displayRevision,
      value: item.id,
      documentId: item.document?.id,
    }));
  };

  const value = renderOptions()?.find(option => option.value === values[field]?.id);

  return (
    <FormikField name={field}>
      <Autocomplete
        {...{ onChange }}
        key={isEmpty(values) ? 'disabled' : 'enabled'}
        value={value}
        options={renderOptions()}
        getOptionLabel={(option) => option.label ?? ''}
        disabled={isUpdateAction}
        size="small"
        renderInput={(params: RenderInputParams) => (
          <Box display="flex">
            <Box width="100%" data-cy="reference-items">
              <TextField
                {...params}
                fullWidth
                variant="outlined"
                placeholder={translate('common.select')}
                InputProps={{
                  ...params.InputProps,
                  style: { padding: '0px 30px 0px 9px', borderRadius: 3 },
                  startAdornment: <div>{params.InputProps.startAdornment}</div>,
                  endAdornment: (
                    <>
                      {loading && (
                        <CircularProgress color="inherit" size={16} />
                      )}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
                inputProps={{
                  ...params.inputProps,
                  style: { padding: '4.5px 0' },
                }}
              />
            </Box>
          </Box>
        )}
        PopperComponent={({ style, ...props }) => (
          <Popper
            {...props}
            modifiers={[
              {
                name: 'flip',
                options: {
                  fallbackPlacements: [],
                },
              },
            ]}
            style={{ ...style }}
          />
        )}
        renderOption={(option) => option.label}
        disableClearable
        loading={loading}
      />
    </FormikField>
  );
};

export const ItemIDcell: React.FC<Props> = (props) => {
  const { field, dataItem, onClick } = props;
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  if (isEditMode) {
    return <Editor {...props} />;
  }

  const handleClick = () => onClick?.({ dataItem });
  const blockEditing = (e: MouseEvent) => e.stopPropagation();

  const value = dataItem[field] as EditableShippingItem['part'];
  const displayValue = value?.name ?? EMPTY_VALUE_PLACEHOLDER;
  const linkPath = (!isEmpty(value) && value?.documentId) ? documentVersionPath(value?.id, value?.documentId) : undefined;
  const dataCy = `${kebabCase(field)}-cell`;

  return (
    <OverflowTooltip
      title={displayValue}
      placement="top"
      interactive
      arrow
      onClick={handleClick}
      data-cy={dataCy}
    >
      {linkPath ? <Link target="_blank" to={linkPath} onClick={blockEditing}>{displayValue}</Link> : displayValue}
    </OverflowTooltip>
  );
};
