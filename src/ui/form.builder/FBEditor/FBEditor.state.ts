import { includes } from "lodash";
import { action, observable, set } from "mobx";
import React from "react";
import { FBEditorMode, FBEditorModeProps, FBEditorProps, FBInputType } from "..";
import { ReactComponent as ApprovalsIcon } from "../../../assets/images/leftPanel/approvals.svg";
import { ReactComponent as AutoCompleteIcon } from "../../../assets/images/leftPanel/auto_complete.svg";
import { ReactComponent as BlankTplformIcon } from "../../../assets/images/leftPanel/blank_t_pl_form.svg";
import { ReactComponent as CheckboxIcon } from "../../../assets/images/leftPanel/checkbox_group.svg";
import { ReactComponent as CheckPointIcon } from "../../../assets/images/leftPanel/check_point.svg";
import { ReactComponent as DatePickerIcon } from "../../../assets/images/leftPanel/date_picker.svg";
import { ReactComponent as DefaultIcon } from "../../../assets/images/leftPanel/default.svg";
import { ReactComponent as EquipmentIcon } from "../../../assets/images/leftPanel/equipment.svg";
import { ReactComponent as FileuploadIcon } from "../../../assets/images/leftPanel/fileupload.svg";
import { ReactComponent as HyperlinkIcon } from "../../../assets/images/leftPanel/hyperlink.svg";
import { ReactComponent as InLineApprovalIcon } from "../../../assets/images/leftPanel/inline_approvals.svg";
import { ReactComponent as ParagraphIcon } from "../../../assets/images/leftPanel/paragraph.svg";
import { ReactComponent as POApprovalMatrixIcon } from "../../../assets/images/leftPanel/po_approval_matrix.svg";
import { ReactComponent as ProcedureIcon } from "../../../assets/images/leftPanel/procedure.svg";
import { ReactComponent as POIcon } from "../../../assets/images/leftPanel/purchase_order.svg";
import { ReactComponent as QuantityIcon } from "../../../assets/images/leftPanel/quantity.svg";
import { ReactComponent as RadiogroupIcon } from "../../../assets/images/leftPanel/radio_group.svg";
import { ReactComponent as RequestApprovalIcon } from "../../../assets/images/leftPanel/request_approval.svg";
import { ReactComponent as SectionIcon } from "../../../assets/images/leftPanel/section.svg";
import { ReactComponent as SelectIcon } from "../../../assets/images/leftPanel/select.svg";
import { ReactComponent as StepsectionIcon } from "../../../assets/images/leftPanel/step_section.svg";
import { ReactComponent as SubsectionIcon } from "../../../assets/images/leftPanel/sub_section.svg";
import { ReactComponent as SupplierIcon } from "../../../assets/images/leftPanel/supplier.svg";
import { ReactComponent as TextfieldwithrangeIcon } from "../../../assets/images/leftPanel/textfield_with_range.svg";
import { ReactComponent as TextEditorIcon } from "../../../assets/images/leftPanel/text_editor.svg";
import { ReactComponent as TextfieldIcon } from "../../../assets/images/leftPanel/text_field.svg";
import { ReactComponent as TimerIcon } from "../../../assets/images/leftPanel/timer.svg";
import FBEditorAction from "../FBEditorAction/FBEditorAction";
import FBEditorApprovalField from "../FBEditorApprovalField/FBEditorApprovalField";
import FBEditorApprovals from "../FBEditorApprovals/FBEditorApprovals";
import FBEditorAutocomplete from "../FBEditorAutocomplete/FBEditorAutocomplete";
import FBEditorCheckControl from "../FBEditorCheckControl/FBEditorCheckControl";
import FBEditorEmpty from "../FBEditorEmpty/FBEditorEmpty";
import FBEditorEQMaintenance from "../FBEditorEQMaintenance/FBEditorEQMaintenance";
import FBEditorHyperlink from "../FBEditorHyperlink/FBEditorHyperlink";
import FBEditorInlineApproval from "../FBEditorInlineApproval/FBEditorInlineApproval";
import FBEditorInstructionsDocument from "../FBEditorInstructionsDocument/FBEditorInstructionsDocument";
import FBEditorLabel from "../FBEditorLabel/FBEditorLabel";
import FBEditorMediaAlbum from "../FBEditorMediaAlbum/FBEditorMediaAlbum";
import FBEditorOptionGroup from "../FBEditorOptionGroup/FBEditorOptionGroup";
import FBEditorParagraph from "../FBEditorParagraph/FBEditorParagraph";
import FBEditorRequestApproval from "../FBEditorRequestApproval/FBEditorRequestApproval";
import FBEditorSelectDocument from "../FBEditorSelectDocument/FBEditorSelectDocument";
import FBEditorTextEditor from "../FBEditorTextEditor/FBEditorTextEditor";
import FBEditorTextField from "../FBEditorTextField/FBEditorTextField";
import FBEditorTextFieldWithRange from "../FBEditorTextFieldWithRange/FBEditorTextFieldWithRange";
import FBEditorZIPUpload from "../FBEditorZIPUpload/FBEditorZIPUpload";

class FBEditorState {

  public static omitFinalValidation: FBInputType[] = [
    "section",
    "subsection",
    "stepsection",
    "teststep",
    "blanktplform",
  ];

  public static omitValidation: FBInputType[] = [
    "hyperlink",
    "action",
    "paragraph",
    "quantity",
    "timer",
    "purchaseorder",
    "instructionsmediaupload",
    "evidencemediaupload",
    "instructionsdocument",
    "selectdocument",
    "documentRevisions",
    "checkpoint",
    "createlabel",
    "poreceive",
    "approval",
    "requestapproval",
    "hellosign",
    "approvalMatrix",
    "approvalRoles",
    "poApprovalMatrix",
    "task",
    "approvals",
    "procedure",
    "mpiprocedure",
    "eqmaintenance",
    "textfieldwithrange",
  ];

  public static pickDefaultValue: FBInputType[] = [
    "quantity",
    "timer",
    "stepsection",
    "teststep",
    "instructionsmediaupload",
    "evidencemediaupload",
    "instructionsdocument",
    "selectdocument",
    "checkpoint",
    "createlabel",
    "approval",
    "inlineapproval",
    "requestapproval",
    "blanktplform",
    "approvals",
    "lhrstep",
  ];

  public static pickStepIndex: FBInputType[] = ["stepsection", "teststep", "procedure", "mpiprocedure", "lhrstep"];

  public static pickCustomHandler: FBInputType[] = ["teststep"];

  private static editors: Partial<Record<FBInputType, React.FunctionComponent<any>>> = {
    section: FBEditorLabel,
    subsection: FBEditorLabel,
    stepsection: FBEditorLabel,
    teststep: FBEditorLabel,
    textfield: FBEditorTextField,
    checkbox: FBEditorCheckControl,
    checkboxgroup: FBEditorOptionGroup,
    autocomplete: FBEditorAutocomplete,
    texteditor: FBEditorTextEditor,
    datepicker: FBEditorLabel,
    hyperlink: FBEditorHyperlink,
    select: FBEditorOptionGroup,
    radio: FBEditorCheckControl,
    radiogroup: FBEditorOptionGroup,
    fileupload: FBEditorLabel,
    zipattachment: FBEditorZIPUpload,
    blanktplform: FBEditorLabel,
    paragraph: FBEditorParagraph,
    quantity: FBEditorLabel,
    timer: FBEditorLabel,
    purchaseorder: FBEditorLabel,
    poreceive: FBEditorLabel,
    instructionsmediaupload: FBEditorMediaAlbum,
    evidencemediaupload: FBEditorMediaAlbum,
    instructionsdocument: FBEditorInstructionsDocument,
    selectdocument: FBEditorSelectDocument,
    checkpoint: FBEditorLabel,
    createlabel: FBEditorLabel,
    approval: FBEditorApprovalField,
    inlineapproval: FBEditorInlineApproval,
    requestapproval: FBEditorRequestApproval,
    action: FBEditorAction,
    hellosign: FBEditorLabel,
    approvalMatrix: FBEditorEmpty,
    approvalRoles: FBEditorEmpty,
    documentRevisions: FBEditorEmpty,
    poApprovalMatrix: FBEditorLabel,
    task: FBEditorLabel,
    approvals: FBEditorApprovals,
    procedure: FBEditorEmpty,
    mpiprocedure: FBEditorEmpty,
    parts: FBEditorEmpty,
    eqmaintenance: FBEditorEQMaintenance,
    textfieldwithrange: FBEditorTextFieldWithRange,
    supplier: FBEditorLabel,
    lhrstep: FBEditorLabel,
    unitMeasures: FBEditorLabel,
  };

  public static editorTypeIconMapping = {
    section: SectionIcon,
    subsection: SubsectionIcon,
    stepsection: StepsectionIcon,
    textfield: TextfieldIcon,
    checkboxgroup: CheckboxIcon,
    autocomplete: AutoCompleteIcon,
    texteditor: TextEditorIcon,
    datepicker: DatePickerIcon,
    hyperlink: HyperlinkIcon,
    select: SelectIcon,
    radiogroup: RadiogroupIcon,
    paragraph: ParagraphIcon,
    fileupload: FileuploadIcon,
    blanktplform: BlankTplformIcon,
    quantity: QuantityIcon,
    timer: TimerIcon,
    poApprovalMatrix: POApprovalMatrixIcon,
    purchaseorder: POIcon,
    poreceive: POIcon,
    approvalMatrix: POApprovalMatrixIcon,
    approvalRoles: POApprovalMatrixIcon,
    instructionsmediaupload: FileuploadIcon,
    evidencemediaupload: FileuploadIcon,
    procedure: ProcedureIcon,
    mpiprocedure: ProcedureIcon,
    eqmaintenance: EquipmentIcon,
    textfieldwithrange: TextfieldwithrangeIcon,
    supplier: SupplierIcon,
    lhrstep: StepsectionIcon,
    approvals: ApprovalsIcon,
    inlineapproval: InLineApprovalIcon,
    requestapproval: RequestApprovalIcon,
    customcontrol: FileuploadIcon,
    instructionsdocument: ProcedureIcon,
    selectdocument: SelectIcon,
    checkpoint: CheckPointIcon,
    createlabel: CheckPointIcon,
    task: CheckPointIcon,
    action: FileuploadIcon,
    default: DefaultIcon,
  };

  @observable public mode?: FBEditorMode = "config";
  public modeConfig: FBEditorModeProps[] = [
    {
      mode: "config",
      label: "form.builder.field.config",
    },
    {
      mode: "validation",
      label: "form.builder.validation",
    },
  ];

  public static editor = (editorProps: FBEditorProps): React.ReactElement | undefined => {
    const { inputProps: { type = "", index = 0 } = {} } = editorProps;
    const editorControl = FBEditorState.editors[type];
    if (!editorControl) {
      return;
    }
    return React.createElement(editorControl, {
      key: `fb-editor-${type}-${index}`,
      ...editorProps,
      ...type && ({ underValidation: FBEditorState.underValidation(type) }),
      ...type && ({ includeDefaultValue: FBEditorState.includeDefaultValue(type) }),
    });
  };

  public static underValidation = (type: FBInputType) => !includes(FBEditorState.omitValidation, type);
  public static includeDefaultValue = (type: FBInputType) => includes(FBEditorState.pickDefaultValue, type);

  @action public setMode = (mode: FBEditorMode) => set(this, "mode", mode);
}

export default FBEditorState;
