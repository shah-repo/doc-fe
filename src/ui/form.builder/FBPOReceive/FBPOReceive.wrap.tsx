import { useFormikContext } from "formik";
import { get, last } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React from "react";
import { useIntl } from "react-intl";
import { FB, FBDialogState, FBInputType, FBPOReceiveForm, FBPOReceiveFormActions, FBPOReceiveItemProps, FBPOReceiveProps, FBPOReceiveState, FBPurchaseOrderItem, FBSchemaProps } from "..";
import { stripTags } from "../../../common/utils/helpers";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { toastError } from "../../components/notifications";

export const withFBPOReceive = <T extends FBPOReceiveProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    poReceiveState,
    dialogState,
    getOptionLabel,
    onChange,
    initialValues,
    defaultValue,
    disabled,
    loading,
    schema,
    name,
    po,
    ...props
  }: T) => {

    const { workspaceState, formState } = FB.useStores();
    const formValue = formState?.getFieldValue(name);
    const intl = useIntl();
    const { formInput } = workspaceState || {};
    const { receivedItems } = name && formInput?.[name] || { receivedItems: "" };
    const { submitForm } = useFormikContext();

    poReceiveState = FB.useRef<FBPOReceiveState>(FBPOReceiveState, formValue?.id);
    dialogState = FB.useRef<FBDialogState>(FBDialogState);
    defaultValue = formValue?.id;

    const handleItem = (item?: FBPurchaseOrderItem) => {
      if (workspaceState?.isReleased || workspaceState?.isRevised) {
        return;
      }
      if (!workspaceState?.documentId) {
        toastError(intl.formatMessage({ id: "form.builder.save.doc.before.continue" }));
        return;
      }

      dialogState?.config({
        open: true,
        maxWidth: "sm",
        title: "form.builder.po.items.received",
        content: <FBPOReceiveForm {...{ item }} />,
        actions: <FBPOReceiveFormActions {...{ item }} />,
      });
    };

    function setSchemaItem(item: FBSchemaProps): FBPOReceiveItemProps {
      return {
        ...item,
        disabled: true,
        ...(item.type === "purchaseorder") && {
          mode: "preview",
          handleItem,
        },
      };
    }

    function setSchemaProps(schema?: FBSchemaProps[]): FBSchemaProps[] | undefined {
      if (!schema) { return; }
      const prior: Partial<Record<FBInputType | "other", number>> = {
        purchaseorder: 1,
        other: 2,
      };
      schema.sort((a, b) =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        prior[get(a, "type", "other")]! - prior[get(b, "type", "other")]!);

      schema = schema.reduce((reduced: FBSchemaProps[], item) => {
        if (last(reduced)?.type === "purchaseorder" && item.type !== "purchaseorder") {
          reduced.push({ type: "section", label: "form.builder.purchaseorder" });
        }
        reduced.push(setSchemaItem(item));
        return reduced;
      }, []);
      return schema;
    }

    onChange = (_ev, value: DocumentRevision) => {
      poReceiveState?.setPOId(value?.id);
    };

    React.useEffect(() => {
      if (name) {
        formState?.setFieldValue(name, { ...formInput?.[name] });
      }
    }, [receivedItems]);

    React.useEffect(() => reaction(
      () => formState?.inputState.get(`porec-${name}`)?.value,
      (value) => {
        formState?.setFieldValue(name, { id: value });
        formState?.setFieldAutosave(name);
        submitForm();
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    getOptionLabel = (option: DocumentRevision) => `${option.document?.docId} ${stripTags(option.description)}`;

    useObserver(() => {
      loading = poReceiveState?.loading;
      schema = setSchemaProps(poReceiveState?.getSchema());
    });

    return Component({
      ...(props as T),
      poReceiveState,
      dialogState,
      getOptionLabel,
      onChange,
      initialValues: poReceiveState.docValues,
      defaultValue,
      disabled,
      loading,
      schema,
      name,
    });
  };

  return (props: T) => Comp(props);
};
