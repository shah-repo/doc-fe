import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { AxiosRequestConfig } from 'axios';
import { isEmptyArray } from 'formik';
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
      labelsToPrint: 1,
      serial: '',
    };

    const [employees, setEmployees] = useState <SelectOption[]>([]);
    const [selectedOption, setSelectedOption] = useState <SelectOption>();
    const [selectedDate, setSelectedDate] = useState(new Date());

    const [labelsToPrint, setLabelsToPrint] = useState(initialValues?.labelsToPrint);
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

    const onLabelsToPrintChange = (event: any) => {
      if (event.target.value > 10 || event.target.value < 1) {
        return;
      }
      if (labelsToPrint < event.target.value) {
        const newQtyUnits = [...qtyUnits];
        for (let index = 0; index < event.target.value - Number(labelsToPrint); index++) {
          newQtyUnits.push(initialValues?.qtyUnits);
        }
        setQtyUnits(newQtyUnits);
      }
      else {
        qtyUnits.splice(event.target.value);
      }
      setLabelsToPrint(event.target.value);
    };

    const onSerialChange = (event: any) => {
      if(event.target.value.length > 10) {
        return;
      }
      setSerial(event.target.value);
      initialValues.serial = event.target.value;
    };

    const onDescriptionChange = (event: any) => {
      setDescription(event.target.value);
    };

    const onPrintClick = () => {
      const quantity = qtyUnits.map((item, i) => ({ key: i + 1, value: item }));
      const params = {
        status: selectedItem?.lotStatus,
        description: description,
        partDocId: initialValues.partId,
        revision: initialValues.revision,
        actor: selectedOption?.text,
        lotNumber: initialValues.lotId,
        lotRevId: `${SM_APP_CONFIG.REACT_APP_FRONTEND_URL}/document_revision/${data?.documentId}/version/${data?.id}`,
        serial: serial,
        expireDate: selectedItem?.formInput?.lot_expiry_date,
        printDate: moment(selectedDate).format('MMM DD, YYYY'),
        labelsToPrint: labelsToPrint,
        quantity: quantity.reduce((obj, item) => ({ ...obj, [item.key]: item.value	}), {}),
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
        .catch((exception) => { toastError(intl.formatMessage({ id: 'errors.somethingWentWrong' })); });
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
      onLabelsToPrintChange,
      onSerialChange,
      labelsToPrint,
      qtyUnits,
      serial,
      onPrintClick,
      description,
      onDescriptionChange,
      closeDialog,
    });
  };

  return (props: T) => Comp(props);
};
