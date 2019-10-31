import _, { Dictionary } from "lodash";
import { action, autorun, computed, observable } from "mobx";
import { DocumentGroupType } from "../../../state/ducks/documentRevisions/documentType";
import { FBFormDefaultProps } from "../types/common";
import { FBFormTemplateProps } from "../types/formik";
import { FBTemplateSchema } from "../types/store";
import { FBWorkspaceMode } from "../types/workspace";
import editorStore from "./FBEditorStore";

export class FBStore {

    @computed get active(): boolean {
        return this.mode !== "none";
    }

    @computed get prefixName() {
        return `${this.schema.length}_${(this.name || "").replace(" ", "")}`;
    }

    @computed get fieldMode(): Partial<FBFormDefaultProps> {
        return ({
            disabled: this.isDisabled(),
            // readOnly: this.isReadonly(),
            // className: this.isDisabled() ? FBClasses.inputDisabled : "",
        });
    }

    @observable public name?: string = undefined;
    @observable public schema: FBTemplateSchema[] = [];
    @observable public values: { [key: string]: any } = {};
    @observable public mode: FBWorkspaceMode = "none";

    @action public setMode = (mode: FBWorkspaceMode) => {
        this.mode = mode;
        this.setModeConfig();
    }

    @action public getSchemaItem = (index: number): FBTemplateSchema | undefined => {
        return this.schema[index];
      }

      @action public removeSchemaItem = (index?: number) => {
        if (index === undefined) { return; }
        const newSchema = this.schema.filter((o) => o.index !== index);
        this.setSchema(newSchema);
      }

      @action public editSchemaItem = (index?: number) => {
        if (index === undefined) { return; }
        const schema = this.getSchemaItem(index);
        if (!schema) { return; }
        editorStore.editorTypeEdit(schema);
      }

      @action public getSchema = (): FBTemplateSchema[] => {
        return this.schema;
      }

      @action public setSchema = (newSchema: FBTemplateSchema[]) => {
        newSchema.map((o, i) => {
          o.index = i;
        });
        this.schema = newSchema;
      }

    @action private setModeConfig = () => {
        switch (this.mode) {
            case "none":
            case "design":
                this.schema = [];
                this.values = {};
            default: return;
        }
    }

    @action private isDisabled = (): boolean => {
        return this.mode !== "form";
    }
}

const formBuilderStore = new FBStore();
export default formBuilderStore;
