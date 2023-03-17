import React, { useState } from "react";
import { InDraftAROption, TemplateOption } from "../../../../change.request/form/types";
import { Dialog } from "../../../../components/dialogs";
import { Autocomplete, FormField } from "../../../../components/forms/fields-next";
import { DialogHandler } from "../../../../hooks/useDialog";
import useStyles from "./ApproveAndRelease.styles";

interface Props {
  title: string;
  loading: boolean;
  handler: DialogHandler;
  options: TemplateOption[] | InDraftAROption[];
  confirmLabel: string;
  onConfirm: (option?: TemplateOption | InDraftAROption) => void;
}

const SelectionForm: React.FC<Props> = ({
  title,
  handler,
  confirmLabel,
  onConfirm,
  options,
  loading,
}) => {
  const classes = useStyles();
  const [selectedOption, setSelectedOption] = useState<typeof options[number]>();

  const closeDialog = () => {
    setSelectedOption(undefined);
    handler.close();
  };

  return (
    <Dialog
      className={classes.dialog}
      title={title}
      open={handler.isOpen}
      loading={loading}
      confirmLabel={confirmLabel}
      confirmProps={{
        disabled: loading || !selectedOption,
      }}
      cancelLabel="common.cancel"
      onClose={closeDialog}
      onConfirm={() => onConfirm(selectedOption)}
    >
      <FormField
        label="common.choose.template"
        disabled={loading}
        margin="normal"
      >
        <Autocomplete
          value={selectedOption}
          options={options}
          getOptionLabel={(option: TemplateOption | InDraftAROption) => option.label}
          onChange={(e, value) => setSelectedOption(value)}
        />
      </FormField>
    </Dialog>
  );
};

export default SelectionForm;
