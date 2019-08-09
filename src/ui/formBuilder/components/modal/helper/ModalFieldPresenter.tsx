import React, { useEffect, useState } from "react";
import CheckBoxModal from "../fields/CheckBoxModal";
import DatePickerModal from "../fields/DatePickerModal";
import FileUploadModal from "../fields/FileUploadModal";
import HyperLinkModal from "../fields/HyperLinkModal";
import LineFieldModal from "../fields/LineFieldModal";
import ListsModal from "../fields/ListsModal";
import MultipleCheckboxModal from "../fields/MultipleCheckboxModal";
import MultipleHyperLinkModal from "../fields/MultipleHyperLinkModal";
import NumericModal from "../fields/NumericModal";
import ParagraphModal from "../fields/ParagraphModal";
import RadioModal from "../fields/RadioModal";
import SectionModal from "../fields/SectionModal";
import MultiplePackagingModal from "../fields/MultiplePackagingModal";
import ApprovalCollectionModal from "../fields/ApprovalCollectionModal";
import { formBuilderActions } from "../../../../state/ducks/formBuilder";
import { connect } from "react-redux";

interface FieldPresenter {
  chosenField: string;
  clickHandler: any;
  currentConfig?: any;
}

interface DispatchProps {
  ADD_FIELD: typeof formBuilderActions.addField;
  ADD_LIST: typeof formBuilderActions.addList;
}

type FieldPresenterProps = FieldPresenter & DispatchProps;

const FieldPresenter: React.FunctionComponent<FieldPresenterProps> = ({
  chosenField,
  currentConfig,
  clickHandler,
  ADD_FIELD,
  ADD_LIST,
}) => {
  const [modalStateContent, setModalContent] = useState();

  useEffect(() => {
    switch (chosenField) {
      case "singleLine":
        setModalContent(
          <LineFieldModal
            title="Single Line Textfield"
            currentConfig={currentConfig}
            handleSubmit={clickHandler}
          />,
        );
        break;
      case "section":
        setModalContent(
          <SectionModal
            title="Section"
            handleSubmit={clickHandler}
            currentConfig={currentConfig}
          />,
        );
        break;
      case "subSection":
        setModalContent(
          <SectionModal
            title="Sub Section"
            handleSubmit={clickHandler}
            currentConfig={currentConfig}
          />,
        );
        break;
      case "multiLine":
        setModalContent(
          <LineFieldModal
            title="Multi-Line Textfield"
            handleSubmit={clickHandler}
            currentConfig={currentConfig}
          />,
        );
        break;
      case "checkbox":
        setModalContent(
          <CheckBoxModal
            handleSubmit={clickHandler}
            currentConfig={currentConfig}
          />,
        );
        break;
      case "radio":
        setModalContent(
          <RadioModal
            handleSubmit={clickHandler}
            currentConfig={currentConfig}
          />,
        );
        break;
      case "numeric":
        setModalContent(
          <NumericModal
            title="Numeric Field"
            handleSubmit={clickHandler}
            currentConfig={currentConfig}
          />,
        );
        break;
      case "datepicker":
        setModalContent(
          <DatePickerModal
            title="Date Picker Field"
            currentConfig={currentConfig}
            handleSubmit={clickHandler}
          />,
        );
        break;
      case "actionItems":
        ADD_FIELD({
          type: chosenField,
          closed: false,
          config: { colWidth: "col-12", title: "Quality Assurance" },
        });
        break;
      case "hyperlink":
        setModalContent(
          <HyperLinkModal
            handleSubmit={clickHandler}
            currentConfig={currentConfig}
          />,
        );
        break;
      case "multipleHyperlink":
        setModalContent(
          <MultipleHyperLinkModal
            handleSubmit={clickHandler}
            currentConfig={currentConfig}
          />,
        );
        break;
      case "paragraph":
        setModalContent(
          <ParagraphModal
            handleSubmit={clickHandler}
            currentConfig={currentConfig}
          />,
        );
        break;
      case "fileUpload":
        setModalContent(
          <FileUploadModal
            handleSubmit={clickHandler}
            currentConfig={currentConfig}
          />,
        );
        break;
      case "multipleCheckbox":
        setModalContent(
          <MultipleCheckboxModal
            handleSubmit={clickHandler}
            currentConfig={currentConfig}
          />,
        );
        break;
      case "multiplePackaging":
        setModalContent(
          <MultiplePackagingModal
            handleSubmit={clickHandler}
            currentConfig={currentConfig}
          />,
        );
        break;
      case "approvalCollection":
        setModalContent(
          <ApprovalCollectionModal
            handleSubmit={clickHandler}
            currentConfig={currentConfig}
          />,
        );
        break;
      case "qa":
        ADD_FIELD({
          type: chosenField,
          closed: false,
          config: { colWidth: "col-12", title: "Quality Assurance" },
        });
        break;
      case "operations":
        ADD_FIELD({
          type: chosenField,
          closed: false,
          config: { colWidth: "col-12", title: "Operations" },
        });
        break;
      case "standards":
      case "finishedGoods":
      case "lots":
      case "mpis":
      case "parts":
      case "sops":
      case "suppliers":
        ADD_LIST(chosenField);
        break;
      case "custom":
        setModalContent(
          <ListsModal
            handleSubmit={clickHandler}
            currentConfig={currentConfig}
          />,
        );
        break;
      case "closeSection":
        ADD_FIELD({
          type: chosenField,
          closed: false,
          diff: [],
          config: { colWidth: "col-12" },
        });
        break;
    }
  }, [chosenField]);

  return <div>{modalStateContent}</div>;
};

export default connect(
  null,
  {
    ADD_FIELD: formBuilderActions.addField,
    ADD_LIST: formBuilderActions.addList,
  },
)(FieldPresenter);
