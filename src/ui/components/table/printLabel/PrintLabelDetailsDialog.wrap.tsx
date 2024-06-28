import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { isEmptyArray } from 'formik';
import { includes, isEmpty, toUpper } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { SM_APP_CONFIG } from '../../../../common/constants';
import { companySelectors } from '../../../../state/ducks/company';
import { LabelTemplatesProps, ZebraPrintSettings } from '../../../../state/ducks/company/types';
import { documentRevisionsActions } from '../../../../state/ducks/documentRevisions';
import { DocumentRevision, Reference } from '../../../../state/ducks/documentRevisions/types';
import { printLabelsActions } from '../../../../state/ducks/printLabels';
import { store } from '../../../../state/store';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import { getLotStatusLabel } from '../../common/header/HeaderLotStatus';
import { KendoColumn as KendoColumnProps } from '../../common/kendo/types';
import { SelectOption } from '../../forms/fields/Select';
import { toastError, toastSuccess } from '../../notifications';
import { PrintLabelDetailsDialogProps, ResponseData } from './PrintLabelDetailsDialog.types';

export const PRINTER_NAME_KEY = 'printerName';
export const PRINTER_LABEL_TYPE_KEY = 'printerLabelType';
const SERIAL_MAX_LENGTH = 14;
const SELECTED_FIELD = 'print';
const initialSelectedParams = ['partDocId', 'revision', 'description', 'lotNumber', 'serial', 'actor', 'printDate'];
export const printColumnProps: KendoColumnProps = { field: SELECTED_FIELD, title: toUpper(SELECTED_FIELD), show: true, sortable: false, locked: true, width: 80 };
export const withPrintLabelDetailsDialog = <T extends PrintLabelDetailsDialogProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    selectedItem,
    closeDialog,
    ...props
  }: T) => {
    const companyEmployees = useSelector(companySelectors.getActiveEmployees);
    const { zebraPrint } = useSelector(companySelectors.getGeneralSettings);
    const authUser = store.getState().auth.user;
    const intl = useIntl();
    const initialValues = {
      lotId: selectedItem?.document?.docId,
      partId: selectedItem?.precalc?.lot_part,
      revision: selectedItem?.precalc?.lot_part_revision,
      qtyUnits: selectedItem?.precalc?.lot_on_hand_quantity,
      serial: '',
    };

    const [employees, setEmployees] = useState<SelectOption[]>([]);
    const [selectedOption, setSelectedOption] = useState<SelectOption>();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedNumberOfLabel, setSelectedNumberOfLabel] = useState(1);
    const [qtyUnits, setQtyUnits] = useState([initialValues?.qtyUnits]);
    const [serial, setSerial] = useState('');
    const [description, setDescription] = useState('');
    const [data, setData] = useState<ResponseData>({} as ResponseData);
    const [selectedParams, setSelectedParams] = useState(initialSelectedParams);
    const [labelTypeData, setLabelTypeData] = useState<LabelTemplatesProps[]>([]);
    const [printerSerial, setPrinterSerial] = useState('');
    const [labelTemplate, setLabelTemplate] = useState('');
    const executeDocumentRevisionAsyncTask = useActionCreator(documentRevisionsActions.loadWithCallback);
    const executePrintLotLabelAsyncTask = useActionCreator(printLabelsActions.postPrintLotLabelAsyncTask);
    const [showError, setShowError] = useState(false);
    const async = useAsync({
      onSuccess: (data?: ResponseData) => {
        const referenceTo = (data?.referenceTo as Reference[]).filter(item => item.docId === initialValues.partId);
        if (!isEmptyArray(referenceTo)) {
          const documentRevision = referenceTo[0].documentRevisions as DocumentRevision[];
          const description = documentRevision.find(item => item.displayRevision === selectedItem?.precalc?.lot_part_revision)?.name;
          setDescription(description ?? '');
        }
        setData(data ?? {} as ResponseData);
      },
    });

    const asyncPrintLabel = useAsync({
      onSuccess: () => {
        toastSuccess(intl.formatMessage({ id: 'common.send.to.print.success' }));
        closeDialog();
      },
      onError: (message) => {
        toastError(message);
      },
    });

    useEffect(() => {
      async.start(
        executeDocumentRevisionAsyncTask,
        selectedItem?.id,
        async,
      );
      const recentPrinter: ZebraPrintSettings = JSON.parse(localStorage.getItem(PRINTER_NAME_KEY) ?? '');
      const isRecentPrinterExist = zebraPrint?.find(item => item.printer.name === recentPrinter?.printer?.name && item.printer.isActive);
      if (isRecentPrinterExist) {
        setPrinterSerial(recentPrinter?.printer?.sn);
        setLabelTypeData(recentPrinter?.printer?.labelTemplates);
        const recentPrinterLabelType: LabelTemplatesProps = JSON.parse(localStorage.getItem(PRINTER_LABEL_TYPE_KEY) ?? '');
        setLabelTemplate(recentPrinterLabelType?.id);
      }
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setEmployees(activeEmployees);
      }

      const defaultEmployee = activeEmployees.find(item => item?.email === authUser.email);
      if (defaultEmployee) {
        setSelectedOption(defaultEmployee);
      }
    }, [companyEmployees]);

    const handleDateChange = (date: MaterialUiPickersDate) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setSelectedDate(new Date(date?.toISOString()));
    };

    const onQtyUnitsChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      if (Number(event?.target?.value) < 0) {
        return;
      }
      const newQtyUnits = [...qtyUnits];
      newQtyUnits[index] = event.target.value;
      setQtyUnits(newQtyUnits);
    };

    const onSerialChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
      if (event.target.value.length > SERIAL_MAX_LENGTH) {
        return;
      }
      setSerial(event.target.value);
      initialValues.serial = event.target.value;
    };

    const onDescriptionChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
      setDescription(event.target.value);
    };

    const onNumberOfLabelChange = (value: number) => {
      if (selectedNumberOfLabel < value) {
        const newQtyUnits = [...qtyUnits];
        for (let index = 0; index < (value - selectedNumberOfLabel); index++) {
          newQtyUnits.push(initialValues?.qtyUnits);
        }
        setQtyUnits(newQtyUnits);
      } else {
        qtyUnits.splice(Number(value));
      }
      setSelectedNumberOfLabel(value);
    };

    const onActorChange = (event: React.ChangeEvent<{}>, value: SelectOption) => {
      setSelectedOption(value);
    };

    const onPrinterChange = (event: React.ChangeEvent<HTMLSelectElement>, value: ZebraPrintSettings) => {
      setPrinterSerial(value.printer.sn);
      setLabelTypeData(value?.printer?.labelTemplates);
      localStorage.setItem(PRINTER_NAME_KEY, JSON.stringify(value));
    };

    const onLabelTypeChange = (event: React.ChangeEvent<HTMLSelectElement>, value: LabelTemplatesProps) => {
      setLabelTemplate(value.id);
      localStorage.setItem(PRINTER_LABEL_TYPE_KEY, JSON.stringify(value));
    };

    const onFieldCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name: fieldName } = event.target;
      if (includes(selectedParams, fieldName)) {
        setSelectedParams(oldValues => { return oldValues.filter(value => value !== fieldName); });
      } else {
        setSelectedParams([...selectedParams, fieldName]);
      }
    };

    const onPrintClick = () => {
      if (isEmpty(printerSerial) || isEmpty(labelTemplate)) {
        return setShowError(true);
      }
      const quantity = qtyUnits.map((item, i) => ({ key: i + 1, value: item }));
      const params = {
        printerSerial: printerSerial,
        labelTemplate: labelTemplate,
        labelData: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          status: getLotStatusLabel(selectedItem?.lotStatus),
          description: selectedParams.includes('description') ? description.slice(0, 90) : '',
          partDocId: selectedParams.includes('partDocId') ? initialValues.partId : '',
          revision: selectedParams.includes('revision') ? initialValues.revision : '',
          actor: selectedParams.includes('actor') ? selectedOption?.text ?? selectedOption : '',
          lotNumber: selectedParams.includes('lotNumber') ? initialValues?.lotId?.split('#')[1] : '',
          lotRevUrl: `${SM_APP_CONFIG.REACT_APP_FRONTEND_URL}/document_revision/${data?.documentId}/version/${data?.id}`,
          serial: selectedParams.includes('serial') ? serial : '',
          expireDate: selectedItem?.formInput?.lot_expiry_date ? moment(selectedItem?.formInput?.lot_expiry_date).format('MMM DD, YYYY') : selectedItem?.formInput?.lot_expiry_date,
          printDate: selectedParams.includes('printDate') ? moment(selectedDate).format('MMM DD, YYYY') : null,
          pH: selectedParams.includes('ph'),
          labelsToPrint: Number(selectedNumberOfLabel),
          quantity: quantity.reduce((obj, item) => ({ ...obj, [item.key]: isEmpty(item.value) ? null : Number(item.value) }), {}),
          quantityUnits: selectedItem?.formInput?.lot_usable_quantity_unit ?? '',
        },
      };
      asyncPrintLabel.start(
        executePrintLotLabelAsyncTask,
        params,
        asyncPrintLabel,
      );
    };

    return Component({
      ...(props as T),
      companyEmployees: employees,
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
      onActorChange,
      onPrinterChange,
      onLabelTypeChange,
      onFieldCheck,
      selectedParams,
      labelTypeData,
      printerSerial,
      labelTemplate,
      showError,
    });
  };

  return (props: T) => Comp(props);
};
