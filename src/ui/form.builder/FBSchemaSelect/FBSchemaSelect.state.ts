import { action, observable, set } from "mobx";
import { FBSchemaProps } from "..";

class FBSchemaSelectState {
  @observable public show = false;
  @observable public schema: FBSchemaProps[] | undefined;

  @action public setSchema = (schema: FBSchemaProps[]) => {
    set(this, "schema", schema);
  };
}

export default FBSchemaSelectState;
