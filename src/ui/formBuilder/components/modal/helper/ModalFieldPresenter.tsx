import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { formBuilderActions } from "../../../../../state/ducks/formBuilder";
import ApprovalCollectionModal from "../fields/ApprovalCollectionModal";
import CheckBoxModal from "../fields/CheckBoxModal";
import DatePickerModal from "../fields/DatePickerModal";
import FileUploadModal from "../fields/FileUploadModal";
import HyperLinkModal from "../fields/HyperLinkModal";
import LineFieldModal from "../fields/LineFieldModal";
import ListsModal from "../fields/ListsModal";
import MultipleCheckboxModal from "../fields/MultipleCheckboxModal";
import MultipleHyperLinkModal from "../fields/MultipleHyperLinkModal";
import MultiplePackagingModal from "../fields/MultiplePackagingModal";
import NumericModal from "../fields/NumericModal";
import ParagraphModal from "../fields/ParagraphModal";
import RadioModal from "../fields/RadioModal";
import SectionModal from "../fields/SectionModal";
import { FieldPresenterProps } from "./types";

interface DispatchProps {
  addField: typeof formBuilderActions.addField;
  addList: typeof formBuilderActions.addList;
}

type Props = FieldPresenterProps & DispatchProps;

const FieldPresenter: React.FunctionComponent<Props> = ({
  chosenField,
  currentConfig,
  clickHandler,
  addField,
  addList,
}) => {
  const [modalStateContent, setModalContent] = useState(<div />);

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
        addField({
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
        addField({
          type: chosenField,
          closed: false,
          config: { colWidth: "col-12", title: "Quality Assurance" },
        });
        break;
      case "operations":
        addField({
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
        addList(chosenField);
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
        addField({
          type: chosenField,
          closed: false,
          diff: [],
          config: { colWidth: "col-12" },
        });
        break;
      default:
        break;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosenField]);

  return <div>{modalStateContent}</div>;
};

export default connect(
  null,
  {
    addField: formBuilderActions.addField,
    addList: formBuilderActions.addList,
  },
)(FieldPresenter);
