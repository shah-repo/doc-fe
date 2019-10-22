import { observer } from "mobx-react";
import React from "react";
import FBAddFieldButton0 from "../../components/custom/FBAddFieldButton0";
import FBEditorWrapper from "../../components/custom/FBEditorWrapper";
import FBForm from "../../components/form/FBForm";
import { FBFieldComponent } from "../../defaults/editor";
import { withFBStore } from "../../hocs/withFBStore";
import formBuilderStore from "../../stores/FBStore";
import { FBStoreProps } from "../../types/store";
import FBEditorDialog from "../editor/FBEditorDialog";
import { Button, Box } from "@material-ui/core";

const FBWorkspace: React.FunctionComponent<FBStoreProps> = ({
  formBuilderStore: { schema, mode },
}) => {
  const isStarter = mode === "design" && schema.length === 0;

  const fieldsRenderer = schema.map((field, i) => {
    const { type, name } = field;
    const InputType = FBFieldComponent[type as string];

    return (
      <FBEditorWrapper key={`${name}_${i}`} index={i} {...field}>
        <InputType {...field} {...formBuilderStore.fieldMode} />
      </FBEditorWrapper>
    );
  });

  const Span = (props: any) => <span {...props} />;

  const importSchema = (e: any) => {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const schema = JSON.parse(event.target.result);
      formBuilderStore.schema = schema;
    };
    reader.readAsText(e.currentTarget.files[0]);
  };

  const exportSchema = (e: any) => {
    e.preventDefault();
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(formBuilderStore.schema));
    const anchor = document.createElement("a");
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.download = `schema.json`;
    anchor.href = dataStr;
    anchor.click();
  };

  return (
    <FBForm initialValues={formBuilderStore.values}>
      {isStarter && <FBAddFieldButton0 />}
      {!isStarter && fieldsRenderer}
      <Box flexDirection="row">
        <input
          hidden={true}
          id="upload-file"
          type="file"
          onChange={importSchema}
          onBlur={importSchema}
        />
        <label htmlFor="upload-file">
          <Button component={Span}>Import</Button>
        </label>

        <Button onClick={exportSchema}>Export</Button>
      </Box>
      <FBEditorDialog />
      {/* <Box display="flex" flexDirection="row-reverse">
        <FBButton label="Create" onClick={handleSubmit} />
      </Box> */}
    </FBForm>
  );
};

export default withFBStore(observer(FBWorkspace));
