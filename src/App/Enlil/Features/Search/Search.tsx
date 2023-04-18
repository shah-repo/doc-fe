import { regular } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InputAdornment, Popper } from "@material-ui/core";
import cx from "classnames";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useHistory } from "react-router-dom";
import { Autocomplete } from "../../../../ui/components/forms/fields-next";
import { withThemeNext } from "../../../../ui/layout/theme-next";
import useStyles from "./Search.styles";

// DUMMY DATA
const searchData = [
  {
    changeRequest: {
      crId: "AR03470",
    },
    description: "artem form 2",
    displayRevision: "1",
    displayStatus: "Released",
    document: {
      docId: "FM-03844",
      documentType: {
        documentTypeAcronym: "FM-",
        documentTypeName: "Form",
      },
      id: "deebcd1a-240b-4b3d-b612-35ee79d660e9",
    },
    effectiveDate: "2023-04-18T07:00:00.000Z",
    id: "9cd247df-b6a5-4138-a212-e9601d5e01c1",
    name: "artem form 2",
  },
  {
    changeRequest: {
      crId: "AR03469",
    },
    description: "artem form 1",
    displayRevision: "1",
    displayStatus: "Released",
    document: {
      docId: "FM-03843",
      documentType: {
        documentTypeAcronym: "FM-",
        documentTypeName: "Form",
      },
      id: "1fe184b1-a97a-4316-ac43-16a8583e810d",
    },
    effectiveDate: "2023-04-18T07:00:00.000Z",
    id: "168579d7-b6a3-4add-8067-3cb1cda0130f",
    name: "artem form 1",
  },
  {
    changeRequest: {
      crId: "AR03457",
    },
    description: "<p>RHTML</p>",
    displayRevision: "2",
    displayStatus: "Released",
    document: {
      docId: "FM-03821",
      documentType: {
        documentTypeAcronym: "FM-",
        documentTypeName: "Form",
      },
      id: "fcf0ff65-1e98-4f74-9ca7-5ef2fc880fbd",
    },
    effectiveDate: "2023-03-29T07:00:00.000Z",
    id: "5bad5d29-71ea-4e30-b111-4caf1dd41e27",
    name: "RHTML",
  },
  {
    changeRequest: {
      crId: "AR01269",
    },
    description: "<p>POAM</p>",
    displayRevision: "1",
    displayStatus: "Released",
    document: {
      docId: "POAM-01245",
      documentType: {
        documentTypeAcronym: "POAM-",
        documentTypeName: "PO Approval Matrix",
      },
      id: "9c9dcf2d-645f-4c7f-aadb-476f77312393",
    },
    effectiveDate: "2021-03-15T02:18:24.343Z",
    id: "48d61292-50cc-4da3-a610-81010b460bbc",
    name: "Purchase Order Approval Matrix (POAM)",
  },
  {
    changeRequest: {
      crId: "AR03468",
    },
    description: "artem test 2",
    displayRevision: "1",
    displayStatus: "Released",
    document: {
      docId: "FM-03837",
      documentType: {
        documentTypeAcronym: "FM-",
        documentTypeName: "Form",
      },
      id: "20855ad9-9385-4e8a-b464-130e4ed99db8",
    },
    effectiveDate: "2023-04-12T07:00:00.000Z",
    id: "32d7d88b-1a13-4caa-8061-6bf1abf8e9d8",
    name: "artem test 2",
  },
  {
    changeRequest: {
      crId: "AR03467",
    },
    description: "Artem test 1",
    displayRevision: "1",
    displayStatus: "Released",
    document: {
      docId: "FM-03835",
      documentType: {
        documentTypeAcronym: "FM-",
        documentTypeName: "Form",
      },
      id: "9c1ee400-512f-418e-98f2-d3ea7fd4f0c0",
    },
    effectiveDate: "2023-04-12T07:00:00.000Z",
    id: "f6f2f1f8-71fc-49be-94ec-0994553d7b15",
    name: "Artem test 1",
  },
  {
    changeRequest: {
      crId: "AR03465",
    },
    description: "<p>PO Default date</p>",
    displayRevision: "1",
    displayStatus: "Released",
    document: {
      docId: "FM-03828",
      documentType: {
        documentTypeAcronym: "FM-",
        documentTypeName: "Form",
      },
      id: "3bc16122-dcd8-43db-9acf-ab1aad3a6916",
    },
    effectiveDate: "2023-04-04T07:00:00.000Z",
    id: "68fc88b9-bcec-4df1-b1b5-01c19221e2e1",
    name: "PO Default date",
  },
  {
    changeRequest: {
      crId: "AR03461",
    },
    description: "<p>Desc</p>",
    displayRevision: "1",
    displayStatus: "Released",
    document: {
      docId: "FM-03827",
      documentType: {
        documentTypeAcronym: "FM-",
        documentTypeName: "Form",
      },
      id: "03fc7af7-788f-4908-9e24-83b963409285",
    },
    effectiveDate: "2023-04-04T07:00:00.000Z",
    id: "da2d7f43-ec5f-48c4-8d52-c3615b80576e",
    name: "AR Default ",
  },
  {
    changeRequest: {
      crId: "AR03460",
    },
    description: "<p>Desc</p>",
    displayRevision: "1",
    displayStatus: "Released",
    document: {
      docId: "FM-03826",
      documentType: {
        documentTypeAcronym: "FM-",
        documentTypeName: "Form",
      },
      id: "7b6dd815-40c1-424f-9bf0-a31ea039ee46",
    },
    effectiveDate: "2023-04-04T07:00:00.000Z",
    id: "116aefa6-ab30-4db7-b45d-3c63840a1a2e",
    name: "PO Doc",
  },
  {
    changeRequest: {
      crId: "AR03459",
    },
    description: "<p>test</p>",
    displayRevision: "1",
    displayStatus: "Released",
    document: {
      docId: "FM-03823",
      documentType: {
        documentTypeAcronym: "FM-",
        documentTypeName: "Form",
      },
      id: "bd2f2f7e-5048-4489-9478-7671e31b37ec",
    },
    effectiveDate: "2023-04-03T07:00:00.000Z",
    id: "31ce5ee5-d087-4ef9-bdce-cbf1ff4c1ecb",
    name: "bulk impore test 2:39",
  },
  {
    changeRequest: {
      crId: "AR03458",
    },
    description: "<p>L_RHTML_FORM</p>",
    displayRevision: "1",
    displayStatus: "Released",
    document: {
      docId: "FM-03822",
      documentType: {
        documentTypeAcronym: "FM-",
        documentTypeName: "Form",
      },
      id: "bb2f3b8c-ef29-4bde-b164-0b00f3b101e8",
    },
    effectiveDate: "2023-03-29T07:00:00.000Z",
    id: "279cd529-fc1e-4d24-ad2a-61fddfea03d9",
    name: "L_RHTML_FORM",
  },
  {
    changeRequest: {
      crId: "AR03455",
    },
    description: "<p>L_PO_RHTML</p>",
    displayRevision: "1",
    displayStatus: "Released",
    document: {
      docId: "FM-03820",
      documentType: {
        documentTypeAcronym: "FM-",
        documentTypeName: "Form",
      },
      id: "89a7e9c7-4c40-4af5-aca2-766056ab6602",
    },
    effectiveDate: "2023-03-29T07:00:00.000Z",
    id: "960eb37b-5a3a-4cff-b352-d14115872c55",
    name: "L_PO_RHTML",
  },
  {
    changeRequest: {
      crId: "AR03454",
    },
    description: "<p>123</p>",
    displayRevision: "1",
    displayStatus: "Released",
    document: {
      docId: "NCO-00027",
      documentType: {
        documentTypeAcronym: "NCO-",
        documentTypeName: "New Company Record",
      },
      id: "a6e13ea1-e495-4d39-a796-75a26f30303b",
    },
    effectiveDate: "2023-03-29T07:00:00.000Z",
    id: "7601a2f3-aee0-4bab-9c2b-7fd4de30ef58",
    name: "Test Company 2",
  },
  {
    changeRequest: {
      crId: "AR03453",
    },
    description: "<p>123</p>",
    displayRevision: "1",
    displayStatus: "Released",
    document: {
      docId: "NCO-00026",
      documentType: {
        documentTypeAcronym: "NCO-",
        documentTypeName: "New Company Record",
      },
      id: "6fe7fe33-991a-4ada-9132-3e8423830f8d",
    },
    effectiveDate: "2023-03-29T07:00:00.000Z",
    id: "406e59f0-ff15-46ce-b466-d90ea192a12e",
    name: "Test Company 1",
  },
  {
    changeRequest: {
      crId: "AR03449",
    },
    description: "<p>test</p>",
    displayRevision: "1",
    displayStatus: "Released",
    document: {
      docId: "FM-03818",
      documentType: {
        documentTypeAcronym: "FM-",
        documentTypeName: "Form",
      },
      id: "cc455add-1b77-40c6-9932-b2e782104950",
    },
    effectiveDate: "2023-03-23T07:00:00.000Z",
    id: "2cf2f644-a2fd-404d-a70f-ee71aa16d898",
    name: "POAM test 11:42",
  },
  {
    changeRequest: {
      crId: "AR03447",
    },
    description: "<p>AR with required field</p>",
    displayRevision: "1",
    displayStatus: "Released",
    document: {
      docId: "FM-03817",
      documentType: {
        documentTypeAcronym: "FM-",
        documentTypeName: "Form",
      },
      id: "9fb1974a-3512-4f80-8a3a-d3662f998011",
    },
    effectiveDate: "2023-03-21T07:00:00.000Z",
    id: "0825fcd2-4b8c-40ce-a34f-75bd2b6f11ce",
    name: "AR with required field",
  },
  {
    changeRequest: {
      crId: "AR03442",
    },
    description: "<p>test</p>",
    displayRevision: "2",
    displayStatus: "Released",
    document: {
      docId: "FM-03815",
      documentType: {
        documentTypeAcronym: "FM-",
        documentTypeName: "Form",
      },
      id: "b0385dde-4337-4f28-b02d-d151fee06a33",
    },
    effectiveDate: "2023-03-17T07:00:00.000Z",
    id: "1b07f04a-0b43-4b1f-98aa-041544144aee",
    name: "Clone file upload quatation file",
  },
  {
    changeRequest: {
      crId: "AR03313",
    },
    description: "<p>test</p>",
    displayRevision: "1",
    displayStatus: "Released",
    document: {
      docId: "CPT-03629",
      documentType: {
        documentTypeAcronym: "CPT-",
        documentTypeName: "Concept",
      },
      id: "5f0b3b11-7fdc-4758-8c46-c3c7ad9743a1",
    },
    effectiveDate: "2023-01-10T08:00:00.000Z",
    id: "2c1dbff5-0e2d-4e37-b436-dd72ff4ffb8b",
    name: "test",
  },
  {
    changeRequest: {
      crId: "AR02090",
    },
    description: "<p>test</p>",
    displayRevision: "1",
    displayStatus: "Released",
    document: {
      docId: "CP-10059",
      documentType: {
        documentTypeAcronym: "CP-",
        documentTypeName: "Clinical Protocol",
      },
      id: "b5fd1367-c20f-4d43-8129-a6c4d318d6da",
    },
    effectiveDate: "2021-10-25T15:31:28.021Z",
    id: "67174a4e-ee37-437d-a4e8-de7743c7f0de",
    name: "preventative maintenance - autocomplete",
  },
  {
    changeRequest: {
      crId: "AR03440",
    },
    description: "<p>test</p>",
    displayRevision: "1",
    displayStatus: "Released",
    document: {
      docId: "FM-03814",
      documentType: {
        documentTypeAcronym: "FM-",
        documentTypeName: "Form",
      },
      id: "8ef65cfa-4090-44f9-b7f1-a211e6358b01",
    },
    effectiveDate: "2023-03-15T07:00:00.000Z",
    id: "94bd7c8f-5041-4d14-89c9-96fb9c61130a",
    name: "clone doc initial test ",
  },
  {
    changeRequest: {
      crId: "AR03437",
    },
    description: "Test 1,2,3,4",
    displayRevision: "1",
    displayStatus: "Released",
    document: {
      docId: "FM-03812",
      documentType: {
        documentTypeAcronym: "FM-",
        documentTypeName: "Form",
      },
      id: "8962b37c-bfe5-4409-855f-98937646c363",
    },
    effectiveDate: "2023-03-14T07:00:00.000Z",
    id: "eb908073-55bb-4d8f-b7b3-f2938bd5e010",
    name: "Test 1,2,3,4",
  },
  {
    changeRequest: {
      crId: "AR03436",
    },
    description: "test s 1 2 3 4",
    displayRevision: "1",
    displayStatus: "Released",
    document: {
      docId: "FM-03811",
      documentType: {
        documentTypeAcronym: "FM-",
        documentTypeName: "Form",
      },
      id: "22d23c11-7c80-4060-a5c2-ccb59681bc86",
    },
    effectiveDate: "2023-03-14T07:00:00.000Z",
    id: "35f9bffb-118b-41f9-9c55-bd432c370385",
    name: "test s 1 2 3 4",
  },
  {
    changeRequest: {
      crId: "AR03434",
    },
    description: "<p>test</p>",
    displayRevision: "2",
    displayStatus: "Released",
    document: {
      docId: "FM-03799",
      documentType: {
        documentTypeAcronym: "FM-",
        documentTypeName: "Form",
      },
      id: "2235a6f1-5a37-4d0a-a90d-ca9acc2e7d7a",
    },
    effectiveDate: "2023-03-14T07:00:00.000Z",
    id: "3cb0cb5e-ca34-4d95-8256-3998888ca427",
    name: "new po clone text",
  },
  {
    changeRequest: {
      crId: "AR03433",
    },
    description: "<p>test</p>",
    displayRevision: "1",
    displayStatus: "Released",
    document: {
      docId: "FM-03809",
      documentType: {
        documentTypeAcronym: "FM-",
        documentTypeName: "Form",
      },
      id: "f998f85e-c0a2-4c39-9cfb-79df38634b76",
    },
    effectiveDate: "2023-03-13T07:00:00.000Z",
    id: "a7ceb7d9-7ba8-49f5-80bb-7b23984e5e93",
    name: "Clone PO 11:55",
  },
  {
    changeRequest: {
      crId: "AR03431",
    },
    description: "<p>test</p>",
    displayRevision: "1",
    displayStatus: "Released",
    document: {
      docId: "FM-03801",
      documentType: {
        documentTypeAcronym: "FM-",
        documentTypeName: "Form",
      },
      id: "e71637f8-2654-4450-adbe-89f104de0b40",
    },
    effectiveDate: "2023-03-13T07:00:00.000Z",
    id: "addc2c66-02b1-4ac3-9cd3-016e9a5cd301",
    name: "clone 2",
  },
];

const Search: React.FC = (props) => {
  const intl = useIntl();
  const history = useHistory();
  const classes = useStyles();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [popperClass, setPopperClass] = useState<string>();

  useEffect(() => {
    setPopperClass(isFocused ? classes.popper : undefined);
  }, [isFocused, classes.popper]);

  const handleSearch = (event: React.ChangeEvent<{}>, value: string | {}) => {
    if (typeof value === "string") {
      return history.push(`/search/${value}`);
    }
    // TODO go directly to document details when selecting actual item
    // history.push(`/document_revision/${value.documentId}/version/${value.docRevId}`);
    return history.push(`/search/${value}`);
  };

  const getOptions = (searchString: string) => {
    if (!searchString) {
      return searchData.slice(0, 3).map((el) => ({
        ...el,
        group: intl.formatMessage({ id: "recent.search" }),
      }));
    }
    return searchData.map((el) => ({
      ...el,
    }));
  };

  const handleFocusChange = (nextState: boolean) => () => setIsFocused(nextState);
  const placeholder = intl.formatMessage({ id: isFocused ? "keyword.to.search" : "common.search" });

  const options = getOptions(searchTerm);

  return (
    <Autocomplete
      freeSolo
      blurOnSelect
      disablePortal
      placeholder={placeholder}
      className={cx(classes.root, { [classes.focused]: isFocused })}
      onFocus={handleFocusChange(true)}
      onBlur={handleFocusChange(false)}
      options={options}
      noOptionsText={intl.formatMessage({ id: "nothing.found" })}
      groupBy={(option) => option.group}
      getOptionLabel={(option) => `${option.document.docId} - ${option.name}`}
      PopperComponent={(props) => <Popper {...props} className={popperClass} />}
      inputProps={{
        endAdornment: null,
        className: cx({ [classes.inputFocused]: isFocused }),
        startAdornment: (
          <InputAdornment position="start" className={ cx({ [classes.icon]: isFocused }) }>
            <FontAwesomeIcon icon={regular("search")} />
          </InputAdornment>
        ),
        onChange: (event) => setSearchTerm(event.target.value),
      }}
      classes={{
        paper: classes.paper,
        option: classes.option,
        groupLabel: classes.groupLabel,
      }}
      onChange={handleSearch}
    />
  );
};

export default withThemeNext(Search);
