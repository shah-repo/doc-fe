import { Box, CircularProgress, TextField } from '@material-ui/core';
import Autocomplete, { RenderInputParams } from '@material-ui/lab/Autocomplete';
import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { translate } from '../../../../../common/intl';
import { lhrSummaryActions } from '../../../../../state/ducks/LHRSummary';
import { DocumentRevision } from '../../../../../state/ducks/documentRevisions/types';
import {
  MODE_FIELD,
  Mode,
} from '../../../../components/KendoDataGrid/constants';
import {
  FormikField,
} from '../../../../components/forms/fields-next';
import { OptionType } from '../../../../components/forms/fields/Autocomplete/types';
import { toastError } from '../../../../components/notifications';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import { FB } from '../../../helpers';
import { LHR_SUMARY_FIELDS } from '../../constants';
import { CustomTemplateProps, EditableLHRSummaryItem } from '../../types';
import { PreviewDoc } from './PreviewDoc';
import { styles } from './styles';
interface CustomOptionType extends OptionType {
  lotStatus: string
  expiryDate: string
}

const Editor: React.FC<CustomTemplateProps> = (props) => {
  const { values, setFieldValue, getFieldProps, setValues }
    = useFormikContext<EditableLHRSummaryItem>();
  const [lots, setLots] = React.useState<DocumentRevision[]>([]);
  const fetchLotsByPartId = useActionCreator(
    lhrSummaryActions.fetchLotsByPartId,
  );
  const { actualId } = values ?? {};
  const classes = styles();
  const [isOpen, setIsOpen] = useState(false);
  const isTypeFieldEmpty = isEmpty(values.type);
  const [loading, setLoading] = useState(false);
  const fetchPartLotsAsync = useAsync({
    onSuccess: (data: DocumentRevision[] = []) => {
      setLots(data);
    },
  });

  const handleOpen = () => {
    if (isTypeFieldEmpty) {
      toastError(translate('lhr.summary.type.empty.error.message'));
    }

    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };
  useEffect(() => {
    if (isEmpty(actualId)) {
      return;
    }

    fetchPartLotsAsync.start(
      fetchLotsByPartId,
      values?.actualId,
      fetchPartLotsAsync,
    );
    setLoading(false);
  }, [values.actualId]);

  const handleChange = (event: ChangeEvent<{}>, value?: CustomOptionType) => {
    setValues({
      ...values,
      lotStatus: value?.lotStatus ?? '',
      expiryDate: value?.expiryDate ?? null,
      lotOrEquipment: value?.value,
    });
  };

  const renderOptions = (): CustomOptionType[] => {
    return lots.map((lot) => ({
      label: translate('lhr.summary.displayRevision', {
        docId: lot.document.docId,
        displayRevision: lot?.displayRevision,
        name: lot?.name,
      }),
      lotStatus: lot?.lotStatus,
      expiryDate: lot?.formInput?.lot_expiry_date,
      value: lot.id,
    }));
  };

  const defaultValue = values[LHR_SUMARY_FIELDS.lotOrEquipment] ?? '';
  const value = FB.isUUID(defaultValue) ? renderOptions().find(
    (option) => option.value === defaultValue,
  ) : { label: defaultValue, value: defaultValue };

  const onInputChange = (
    event: React.ChangeEvent<{}>,
    value: string,
    reason: string,
  ) => {
    if (reason === 'input') {
      setFieldValue(LHR_SUMARY_FIELDS.lotStatus, '');
      setFieldValue(LHR_SUMARY_FIELDS.expiryDate, null);
      setFieldValue(LHR_SUMARY_FIELDS.lotOrEquipment, value);
    }
  };

  return (
    <FormikField name={LHR_SUMARY_FIELDS.lotOrEquipment}>
      <Autocomplete
        {...getFieldProps(LHR_SUMARY_FIELDS.lotOrEquipment)}
        classes={{ option: classes.option }}
        key={isEmpty(lots) ? 'disabled' : 'enabled'}
        value={value}
        options={renderOptions()}
        getOptionLabel={(option) => option.label ?? ''}
        filterOptions={(x) => x}
        size="small"
        renderInput={(params: RenderInputParams) => (
          <Box display="flex">
            <Box width="100%">
              <TextField
                {...params}
                fullWidth
                variant="outlined"
                disabled={isTypeFieldEmpty}
                placeholder={translate('lhr.summary.placeholder.select.enter')}
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
        renderOption={(option) => option.label}
        onInputChange={onInputChange}
        onChange={handleChange}
        open={isOpen}
        onOpen={handleOpen}
        onClose={handleClose}
        disableClearable
        ListboxProps={{ onscroll }}
        loading={loading}
      />
    </FormikField>
  );
};

export const LotIDCell: React.FC<CustomTemplateProps> = ({
  dataItem,
  onClick,
  ...props
}) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  if (isEditMode) {
    return <Editor {...props} {...{ dataItem }} />;
  }

  return <PreviewDoc detailsObj= {dataItem?.lotOrEquipmentDetails} field={LHR_SUMARY_FIELDS.lotOrEquipment} dataItem={dataItem} onClick={onClick} />;
};
