import { get, isEmpty, isUndefined, toNumber } from 'lodash';
import { reaction } from 'mobx';
import React, { FocusEventHandler, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { FB, FBTextFieldProps } from '..';
import { THRESHOLD_KEY } from '../../../state/ducks/documentRevisions/constants';
import { WO_LOT_ID_KEY_NAME } from '../../../state/ducks/documentRevisions/documentType/types';
import { useFormContext } from '../../components/forms/FormContext';
import { checkIsDocumentPOAM } from '../../documentRevision/helpers/checkDocumentGroup';
import { isTranslation } from '../../translations/types';

export const withFBTextField = <T extends FBTextFieldProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = ({
    onFocus,
    multiline,
    rows = 1,
    placeholder = '',
    defaultValue,
    disabled,
    name = '',
    value,
    ...props
  }: T) => {
    const { formState, workspaceState } = FB.useStores();
    const { submitForm } = useFormContext();
    const { workspaceMode: mode } = formState ?? {};
    const { id } = workspaceState ?? {};
    const isDocumentPOAM = checkIsDocumentPOAM(workspaceState?.document?.document?.documentType?.groupOptions);
    defaultValue = defaultValue ?? formState?.getFieldValue(name);

    if (!['justificationOfChange', 'descriptionOfChange'].includes(name)) {
      value = value ?? formState?.getFieldValue(name);
    }

    const intl = useIntl();
    disabled = (
      disabled
      || get(props.hellosignFlowProps, 'type') === 'HS_DEFINED_FIELD'
      || formState?.getFieldValue('signatureRequestId')
    );

    if (name === WO_LOT_ID_KEY_NAME) {
      disabled = true;
    }

    (isUndefined(multiline)) && (
      multiline = Boolean(rows && (rows as number) > 1)
    );

    isTranslation(placeholder) && (placeholder = intl.formatMessage({ id: placeholder }));
    onFocus = () => {
      if (formState?.isBackdropOpen) { return; }
      if (!name) { return; }
      if (!id) { return; }
      formState?.lockField({
        fields: [{
          formInput: [{
            [name]: true,
          }],
        }],
        documentRevisionId: id,
      }, name);
    };

    const roundToStep = function <T = number | string>(value: T, rawStep: T, rawMin: T, rawMax: T) {
      const number = toNumber(value);
      const min = isEmpty(rawMin) ? Number.MIN_VALUE : toNumber(rawMin);
      const max = isEmpty(rawMax) ? Number.MAX_VALUE : toNumber(rawMax);
      const step = isEmpty(rawStep) ? false : toNumber(rawStep);
      const roundedNumber = step ? Math.round((number - min) / step) * step + min : number;

      return Math.min(
        max,
        Math.max(
          min,
          roundedNumber,
        ),
      );
    };

    const onBlur: FocusEventHandler<HTMLInputElement> = (ev) => {
      const { type, value, step, min, max } = ev.target;

      if (formState?.isBackdropOpen) {
        ev.target.focus();
        return;
      }
      if (!name) {
        return;
      }
      if (type === 'number' && !isEmpty(value) && (!isEmpty(step) || !isEmpty(min) || !isEmpty(max))) {
        const numericSteppedValue = roundToStep(value, step, min, max);
        formState?.setFieldValue(name, numericSteppedValue, true);
      }
      if (isDocumentPOAM && name === THRESHOLD_KEY && isEmpty(value)) {
        // Setting POAM Item form value back to 0 If the value is removed
        formState?.setFieldValue(name, 0, true);
      }
      formState?.unlockField(name);
      formState?.setFieldAutosave(name);

      const isArItemField = name.includes('.justificationOfChange') || name.includes('.descriptionOfChange');
      if (workspaceState?.isChangeRequest && workspaceState?.autosave && isArItemField) {
        submitForm();
        return;
      }

      const isLhrStartField = name.includes('lhrs-start-quantity');
      if (!workspaceState?.autosave && isLhrStartField) {
        workspaceState?.saveDocRev(formState?.getValues(), true);
      }
    };

    useEffect(() => reaction(
      () => workspaceState?.formInputSync.get(name) as string | undefined,
      (value?: string) => {
        formState?.setFieldValue(name, value, true);
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    return Component({
      ...(props as T),
      onFocus,
      onBlur,
      multiline,
      placeholder,
      disabled,
      defaultValue,
      name,
      rows,
      mode,
      value,
    });
  };
  return (props: T) => Comp(props);
};
