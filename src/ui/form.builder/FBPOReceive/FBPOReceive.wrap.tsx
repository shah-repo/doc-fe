import _ from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { useIntl } from "react-intl";
import { FB, FBPOReceiveForm, FBPOReceiveFormActions, FBPOReceiveItemProps, FBPOReceiveProps, FBPOReceiveState, FBPurchaseOrderItem, FBSchemaProps } from "..";
import { stripTags } from "../../../common/utils/helpers";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { FBDialogState } from "../FBDialog";
import { FBInputType } from "../FBInput";

export const withFBPOReceive = <T extends FBPOReceiveProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    poReceiveState,
    dialogState,
    initialValues,
    disabled,
    onChange,
    loading,
    schema,
    name,
    po,
    getOptionLabel,
    ...props
  }: T) => {

    const { workspaceState, formState } = FB.useStores();
    const { documentId } = workspaceState || {};
    const formValue = formState?.getFieldValue(name);
    const intl = useIntl();

    poReceiveState = FB.useRef<FBPOReceiveState>(FBPOReceiveState, formValue);
    dialogState = FB.useRef<FBDialogState>(FBDialogState);
    disabled = disabled || Boolean(documentId);

    const handleItem = (item?: FBPurchaseOrderItem) => {
      if (workspaceState?.isReleased || workspaceState?.isRevised) {
        return;
      }
      if (!workspaceState?.documentId) {
        alert(intl.formatMessage({ id: "form.builder.save.doc.before.continue" }));
        return;
      }

      dialogState?.config({
        open: true,
        maxWidth: "sm",
        title: "form.builder.po.items.received",
        content: <FBPOReceiveForm />,
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
        prior[_.get(a, "type", "other")]! - prior[_.get(b, "type", "other")]!);

      schema = schema.reduce((reduced: FBSchemaProps[], item) => {
        if (_.last(reduced)?.type === "purchaseorder" && item.type !== "purchaseorder") {
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

    getOptionLabel = (option: DocumentRevision) => `${option.document?.docId} ${stripTags(option.description)}`;

    useObserver(() => {
      loading = poReceiveState?.loading;
      schema = setSchemaProps(poReceiveState?.getSchema());
    });

    return Component({
      ...(props as T),
      onChange,
      poReceiveState,
      dialogState,
      initialValues: poReceiveState.docValues,
      disabled,
      loading,
      schema,
      name,
      getOptionLabel,
    });
  };

  return (props: T) => Comp(props);
};
