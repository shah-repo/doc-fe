import { Window } from "@progress/kendo-react-dialogs";
import { TextArea } from "@progress/kendo-react-inputs";
import React from "react";

export const SchemaForm = (props) =>
  (
    <Window title={"Schema"} onClose={props.cancelEdit} initialHeight={450}
      minimizeButton={() => null}
      maximizeButton={() => null}>
      <form className="k-form" >
        <label className="k-form-field">
          <TextArea rows={15} value={JSON.stringify(props.item, undefined, 4)}  placeholder="Schema"/>
        </label>
        <div className="k-form-field">
          <button type="button" className="k-button" onClick={props.cancelEdit}
          >
              Cancel
          </button>
          <button
            type="submit"
            className="k-button k-primary"
            style={{
              float: "right",
            }}
          >
              Add
          </button>
        </div>
      </form>
    </Window>
  );
