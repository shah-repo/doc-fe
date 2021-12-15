import { Window, WindowActionsBar } from "@progress/kendo-react-dialogs";
import { TextArea } from "@progress/kendo-react-inputs";
import React from "react";
import GridCellStyles from "./grid.cell.styles";

export const SchemaForm = (props) => {
  const classes = GridCellStyles();
  return (
    <Window title={"Schema"} onClose={props.cancelEdit} className="schemaForm"
      initialHeight={505}
      initialWidth={524}
      minimizeButton={() => null}
      maximizeButton={() => null}>
      {/* className="schemaForm" */}
      <div>
        {
          props.isEdit ? <TextArea rows={18} defaultValue={JSON.stringify(props.item, undefined, 4)}  placeholder="Schema"/> :
            <TextArea rows={18} value={JSON.stringify(props.item, undefined, 4)}  placeholder="Schema"/>
        }
      </div>
      <WindowActionsBar layout={"end"}>
        <button type="button" className={`${"k-button"} ${classes.schemaCancelBtn}`} onClick={props.cancelEdit}>
              Cancel
        </button>
        <button
          type="button"
          className= {`${"k-button"} ${classes.schemaAddBtn}`}
          disabled={!props.isEdit}
        >Add</button>
      </WindowActionsBar>
    </Window>
  );
}
;
