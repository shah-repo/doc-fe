import { Box, CircularProgress, Popper, TextField } from '@material-ui/core';
import Autocomplete, { RenderInputParams } from '@material-ui/lab/Autocomplete';
import { useFormikContext } from 'formik';
import { isEmpty, kebabCase } from 'lodash';
import React, { ChangeEvent, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { translate } from '../../../../common/intl';
import { DocumentRevision } from '../../../../state/ducks/documentRevisions/types';
import { FormikField } from '../../../components/forms/fields-next';
import { OptionType } from '../../../components/forms/fields/Autocomplete/types';
import { Mode, MODE_FIELD } from '../../../components/KendoDataGrid/constants';
import OverflowTooltip from '../../../components/OverflowTooltip';
import { documentVersionPath } from '../../../document.revision/utils/paths';
import { FB } from '../../helpers';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';
import { CustomTemplateProps, EditableShippingItem } from '../types';
import { styles } from './styles';

interface Props extends CustomTemplateProps {
  loading: boolean
  options: DocumentRevision[]
  fetchLotsByPartId: (id?: string) => any
}

interface CustomOptionType extends OptionType {
  docId: string
  documentId: string
}

const Editor: React.FC<Props> = ({ field, dataItem, fetchLotsByPartId, options, loading }) => {
  const { values, getFieldProps, setFieldValue } = useFormikContext<EditableShippingItem>();
  const isUpdateAction = Mode.edit === dataItem[MODE_FIELD];
  const { part } = values ?? {};
  const classes = styles();

  useEffect(() => {
    if (!FB.isUUID(part?.id)) {
      return;
    }
    fetchLotsByPartId(part?.id);
  }, [part]);

  const handleChange = (event: ChangeEvent<{}>, value?: CustomOptionType) => {
    setFieldValue(field, { id: value?.value, name: value?.docId, documentId: value?.documentId });
  };

  const renderOptions = (): CustomOptionType[] => {
    return options.map((lot) => ({
      label: translate('form.builder.shipping.items.label', {
        docId: lot.document.docId,
        displayRevision: lot?.displayRevision,
        name: lot?.name,
      }),
      value: lot.id,
      docId: lot.document?.docId,
      documentId: lot.document?.id,
    }));
  };

  const value = renderOptions()?.find(option => option.value === values[field]?.id);

  return (
    <>
      <FormikField name={field}>
        <Autocomplete
          {...getFieldProps(field)}
          classes={{ option: classes.option }}
          key={(isEmpty(values) || loading) ? 'disabled' : 'enabled'}
          value={value}
          options={renderOptions()}
          getOptionLabel={(option) => option?.label ?? ''}
          disabled={isUpdateAction}
          size="small"
          renderInput={(params: RenderInputParams) => (
            <Box display="flex">
              <Box width="100%">
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
          onChange={handleChange}
          disableClearable
          loading={loading}
        />
      </FormikField>
    </>
  );
};

export const LotIDCell: React.FC<Props> = (props) => {
  const { field, dataItem, onClick } = props;
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  if (isEditMode) {
    return <Editor {...props} />;
  }

  const handleClick = () => onClick?.({ dataItem });
  const blockEditing = (e: MouseEvent) => e.stopPropagation();

  const value = dataItem[field] as EditableShippingItem['lot'];
  const displayValue = value?.name || EMPTY_VALUE_PLACEHOLDER;
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
