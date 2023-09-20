import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { AxiosRequestConfig } from 'axios';
import { isEmptyArray } from 'formik';
import { isArray } from 'lodash';
import moment from 'moment';
import qs from 'query-string';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { PrintLabelDetailsDialogProps } from '..';
import { SM_APP_CONFIG } from '../../../../common/constants';
import { convertHtmlEntities } from '../../../../common/utils/helpers';
import apiClient from '../../../../state/apiClient';
import { companySelectors } from '../../../../state/ducks/company';
import { DocumentRevision, Reference } from '../../../../state/ducks/documentRevisions/types';
import { store } from '../../../../state/store';
import { FBEndpoint } from '../../../form.builder/defaults/FBEndpoint';
import { SelectOption } from '../../forms/fields/Select';
import { toastError, toastSuccess } from '../../notifications';

export const withPrintLabelDetailsDialog = <T extends PrintLabelDetailsDialogProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    selectedItem,
    closeDialog,
    ...props
  }: T) => {
    const companyEmployees = useSelector(companySelectors.getActiveEmployees);
    const authUser = store.getState().auth.user;
    const intl = useIntl();
    const initialValues = {
      lotId: selectedItem?.document?.docId,
      partId: selectedItem?.precalc?.lot_part,
      revision: selectedItem?.precalc?.lot_part_revision,
      qtyUnits: selectedItem?.precalc?.lot_on_hand_quantity,
      serial: '',
    };

    const [employees, setEmployees] = useState <SelectOption[]>([]);
    const [selectedOption, setSelectedOption] = useState <SelectOption>();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedNumberOfLabel, setSelectedNumberOfLabel] = useState <string>('1');
    const [qtyUnits, setQtyUnits] = useState([initialValues?.qtyUnits]);
    const [serial, setSerial] = useState('');
    const [description, setDescription] = useState('');
    const [data, setData] = useState({});

    useEffect(() => {
      const requestConfig: AxiosRequestConfig = {
        method: 'get',
        url: `${FBEndpoint.DocumentRevisionsUrl}/${selectedItem?.id}`,
        paramsSerializer: (params) => qs.stringify(params),
        headers: {
          Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
        },
      };
      apiClient
        .request(requestConfig)
        .then((resp) => resp)
        .then(({ data }) => {
          const referenceTo = (data?.referenceTo as Reference[]).filter(item => item.docId === initialValues.partId);
          if(!isEmptyArray(referenceTo)) {
            const documentRevision = referenceTo[0].documentRevisions as DocumentRevision[];
            const description = documentRevision[documentRevision.length - 1].description;
            setDescription(convertHtmlEntities(description.replace(/(<([^>]+)>|\/n)/g, '')));
          }
          setData(data);
        });
    }, []);

    useEffect(() => {
      const activeEmployees = companyEmployees.map((employee) => {
        if (employee.user?.name) {
          return ({
            value: employee.id as string,
            text: employee.user?.name || '',
            email: employee.user?.email || '',
          });
        }
      }).filter(Boolean);
      if (activeEmployees) {
        setEmployees(activeEmployees);
      }

      const defaultEmployee = activeEmployees.find(item => item?.email === authUser.email);
      if (defaultEmployee) {
        setSelectedOption(defaultEmployee);
      }
    }, [companyEmployees]);

    const handleDateChange = (date: MaterialUiPickersDate) => {
      setSelectedDate(new Date(date?.toISOString()));
    };

    const onQtyUnitsChange = (event, index) => {
      if (event.target.value < 0) {
        return;
      }
      const newQtyUnits = [...qtyUnits];
      newQtyUnits[index] = event.target.value;
      setQtyUnits(newQtyUnits);
    };

    const onSerialChange = (event: any) => {
      if(event.target.value.length > 14) {
        return;
      }
      setSerial(event.target.value);
      initialValues.serial = event.target.value;
    };

    const onDescriptionChange = (event: any) => {
      setDescription(event.target.value);
    };

    const onNumberOfLabelChange = (value: string) => {
      if (Number(selectedNumberOfLabel) < Number(value)) {
        const newQtyUnits = [...qtyUnits];
        for (let index = 0; index < Number(value) - Number(selectedNumberOfLabel); index++) {
          newQtyUnits.push(initialValues?.qtyUnits);
        }
        setQtyUnits(newQtyUnits);
      }
      else {
        qtyUnits.splice(Number(value));
      }
      setSelectedNumberOfLabel(String(value));
    };

    const onPrintClick = () => {
      const quantity = qtyUnits.map((item, i) => ({ key: i + 1, value: item }));
      const params = {
        status: selectedItem?.lotStatus,
        description: description,
        partDocId: initialValues.partId,
        revision: initialValues.revision,
        actor: selectedOption?.text,
        lotNumber: initialValues?.lotId?.split('#')[1],
        lotRevUrl: `${SM_APP_CONFIG.REACT_APP_FRONTEND_URL}/document_revision/${data?.documentId}/version/${data?.id}`,
        serial: serial,
        expireDate: selectedItem?.formInput?.lot_expiry_date ? moment(selectedItem?.formInput?.lot_expiry_date).format('MMM DD, YYYY') : selectedItem?.formInput?.lot_expiry_date,
        printDate: moment(selectedDate).format('MMM DD, YYYY'),
        labelsToPrint: Number(selectedNumberOfLabel),
        quantity: quantity.reduce((obj, item) => ({ ...obj, [item.key]: Number(item.value) }), {}),
      };
      const requestConfig: AxiosRequestConfig = {
        method: 'post',
        url: FBEndpoint.PrintLabels,
        data: JSON.parse(JSON.stringify(params)),
        headers: {
          Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
        },
      };
      apiClient
        .request(requestConfig)
        .then((resp) => {
          toastSuccess(intl.formatMessage({ id: 'common.send.to.print.success' }));
          closeDialog();
        })
        .catch((exception) => {
          const errorMessage = exception?.response?.data?.message;
          toastError(isArray(errorMessage) ? errorMessage[0] : errorMessage);
        });
    };

    return Component({
      ...(props as T),
      companyEmployees: employees,
      setSelectedOption,
      handleDateChange,
      selectedOption,
      selectedDate,
      selectedItem,
      initialValues,
      onQtyUnitsChange,
      onSerialChange,
      qtyUnits,
      serial,
      onPrintClick,
      description,
      onDescriptionChange,
      closeDialog,
      onNumberOfLabelChange,
      selectedNumberOfLabel,
    });
  };

  return (props: T) => Comp(props);
};
