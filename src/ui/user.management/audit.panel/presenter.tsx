import { Box, Drawer, IconButton, LinearProgress, ListItem } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import axios, { AxiosRequestConfig, CancelTokenSource } from "axios";
import { each, groupBy, map, pick, values } from "lodash";
import qs from "query-string";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import apiClient from "../../../state/apiClient";
import { NullableArray } from "../../../state/ducks/common/types";
import { companySelectors } from "../../../state/ducks/company";
import { userManagementSelectors } from "../../../state/ducks/userManagement";
import { HISTORY_URL } from "../../../state/ducks/userManagement/constants";
import { ACTION_TITLE_MAPPIING, AuditDetailsProps } from "../../../state/ducks/userManagement/types";
import { store } from "../../../state/store";
import Text from "../../components/Text";
import { LoadMoreButton } from "../../dashboard.new/LoadMoreButton";
import Colors from "../../layout/theme/utils/colors";
import Default from "./Cards/Default";
import styles from "./styles";

let call: CancelTokenSource;
interface OwnProps {
  openHistoryPanel: boolean;
  closeHistoryPanel: (panel: boolean) => void;
}

interface TranslatedTextProps {
  [employeeName: string]: string;
}

const AuditItemPresenter: React.FunctionComponent<OwnProps> = ({
  openHistoryPanel,
  closeHistoryPanel,
}) => {
  // Take from constants
  const limit = 5;
  const classes = styles();
  const [isLoading, setIsLoading] = useState(false);
  const [opendrawer, setOpenDrawer] = React.useState({ right: openHistoryPanel });
  const [Items, setItems] = React.useState<NullableArray<AuditDetailsProps[]>>([]);
  const [page, setPage] = useState(0);
  const groups = useSelector(userManagementSelectors.groupsById);
  const allEmployees = useSelector(companySelectors.getAllEmployees) || [];
  const intl = useIntl();

  const getTransalatedText = (key: string, values: TranslatedTextProps) =>  intl.formatMessage({ id: `user.management.audit.history.${key}` }, values);

  const getUserDetails = (userId: string) => allEmployees.find((obj) => obj.id === userId);
  const getGroupName = (groupId) => groups[groupId] ? groups[groupId].name : groupId;
  const closeDrawer = () => {
    setOpenDrawer({ ...opendrawer, right: false });
    closeHistoryPanel(opendrawer.right);
  };

  React.useEffect(() => {
    fetchAuditRecords();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDescription = (auditRecord, ownerDetails, employeeDetails) => {
    // console.log("employeeDetails :: ", employeeDetails);
    let actionInfo = {
      primaryText: ACTION_TITLE_MAPPIING.Unknown as string,
      secondayText: auditRecord.id,
      auditType: ACTION_TITLE_MAPPIING.Unknown,
    };
    if (auditRecord.fieldPath === "name" && auditRecord.type === "STRING_EDITED") {
      actionInfo = {
        primaryText: getTransalatedText(ACTION_TITLE_MAPPIING.EmployeeNameUpdated, {}),
        secondayText: `${auditRecord.previousValue} to ${auditRecord.nextValue}`,
        auditType: ACTION_TITLE_MAPPIING.EmployeeNameUpdated,
      };
    } else if (auditRecord.fieldPath === "groups" && auditRecord.type === "ARRAY_NEW") {
      if (auditRecord.previousValue === "undefined") {
        actionInfo = {
          primaryText: getTransalatedText(ACTION_TITLE_MAPPIING.AddedToGroups, {}),
          secondayText: getGroupName(auditRecord.nextValue),
          auditType: ACTION_TITLE_MAPPIING.AddedToGroups,
        };
      }
    } else if (auditRecord.fieldPath === "groups" && auditRecord.type === "ARRAY_DELETED") {
      actionInfo = {
        primaryText: getTransalatedText(ACTION_TITLE_MAPPIING.DeletedFromGroups, {}),
        secondayText: getGroupName(auditRecord.previousValue),
        auditType: ACTION_TITLE_MAPPIING.DeletedFromGroups,
      };
    } else if (auditRecord.fieldPath === "active" && auditRecord.type === "BOOLEAN_NEW") {
      actionInfo = {
        primaryText: getTransalatedText(ACTION_TITLE_MAPPIING.CreatedNewUser, {}),
        secondayText: auditRecord.employeeName,
        auditType: ACTION_TITLE_MAPPIING.CreatedNewUser,
      };
    } else if (auditRecord.fieldPath === "name" && auditRecord.type === "STRING_NEW") {
      actionInfo = {
        primaryText: getTransalatedText(ACTION_TITLE_MAPPIING.ActivateUser, { employeeName: auditRecord.nextValue }),
        secondayText: "Active",
        auditType: ACTION_TITLE_MAPPIING.ActivateUser,
      };
    }
    else if (auditRecord.fieldPath === "active" && auditRecord.type === "BOOLEAN_EDITED") {
      if (auditRecord.previousValue === "true" && auditRecord.nextValue === "false") {
        actionInfo = {
          primaryText: getTransalatedText(ACTION_TITLE_MAPPIING.DeactivateUser, {}),
          secondayText: auditRecord.employeeName,
          auditType: ACTION_TITLE_MAPPIING.DeactivateUser,
        };
      }
      if (auditRecord.previousValue === "false" && auditRecord.nextValue === "true") {
        actionInfo = {
          primaryText: getTransalatedText(ACTION_TITLE_MAPPIING.ActivateUser, { employeeName: employeeDetails?.user?.name }),
          secondayText: auditRecord.nextValue === "true" ? "Active" : "Inactive",
          auditType: ACTION_TITLE_MAPPIING.ActivateUser,
        };
      }
    }
    return actionInfo;
  };
  const createGroups = (groupedItems) => {
    // console.log("groupedItems", groupedItems);
    const similarGroups = groupBy(groupedItems, "primaryText");
    return map(similarGroups, (items, key) => {
      const auditType = items[0].auditType;
      let primaryText = key;
      const secondayText = map(items, "secondayText");
      if (auditType === ACTION_TITLE_MAPPIING.AddedToGroups as string && secondayText.length <= 1) {
        primaryText = getTransalatedText(ACTION_TITLE_MAPPIING.AddedToGroup, {});
      }
      return { primaryText, secondayText: secondayText.join(", ") };
    });
  };
  // Update response type
  const getCardGroups = (response, index) => {
    const auditRecords = map(response, (auditRecord) => {
      const employeeDetails = getUserDetails(auditRecord.employeeId);
      const ownerDetails = getUserDetails(auditRecord.ownerId);
      return {
        ...auditRecord,
        groupKey: `${auditRecord.groupId}-${auditRecord.timestamp}-${auditRecord.ownerId}`,
        ownerDetails,
        employeeDetails,
        // for Pagination test Added Page no. TODO: Remove
        timestamp: `${getFormattedDateString(auditRecord.timestamp, MomentFormats.BriefDateTime)}  Page No.-${index}`,
        ...getDescription(auditRecord, ownerDetails, employeeDetails),
      };
    });
    // console.log("debug :: auditRecords :: ", auditRecords);
    // Create a Group Data for each Card to be represented
    const auditRecordGroups = groupBy(auditRecords, "groupKey");
    const cardGroups = {};
    each(auditRecordGroups, (groupedItems, groupKey) => {
      cardGroups[groupKey] = {
        ...pick(auditRecordGroups[groupKey][0], [
          "timestamp",
          "id",
          "ownerDetails",
          "employeeDetails",
        ]),
        descriptions: createGroups(groupedItems),
      };
    });
    // console.log("debug :: cardGroups :: ", cardGroups);
    return cardGroups;
  };

  const fetchAuditRecords = () => {
     call?.cancel();
     call = axios.CancelToken.source();
     setIsLoading(true);
     const requestConfig: AxiosRequestConfig = {
       method: "get",
       url: HISTORY_URL,
       params: { offset: page, limit },
       paramsSerializer: (params) => qs.stringify(params),
       headers: {
         Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
       },
       cancelToken: call.token,
     };
     apiClient
       .request(requestConfig)
       .then((resp) => resp)
       .then(({ data }) => {
         //  TODO: Page is added for testing. Need to remove
         const cardGroups = getCardGroups(data.results || [], page);
         setItems((prevState: NullableArray<AuditDetailsProps[]>) => [
           ...prevState,
           ...values(cardGroups),
         ] as NullableArray<AuditDetailsProps[]>);
         setPage((prevPageNumber) => prevPageNumber + limit);
         setIsLoading(false);
       });
  };
  // const fetchAuditRecords = () => {
  //   setIsLoading(true);
  //   const data = {
  //     pageTotal: 5,
  //     results: [
  //       {
  //         createdAt: "2022-03-29T12:56:05.621Z",
  //         updatedAt: "2022-03-29T12:56:05.621Z",
  //         internalTags: [],
  //         id: "43654e2d-676d-46bf-989e-f36ea656b8ef",
  //         changeRequestId: null,
  //         documentRevisionId: null,
  //         referenceId: null,
  //         employeeId: "e348ee87-6177-4328-8603-4c4f6e76685e",
  //         userId: "772335f4-1c5b-415f-a708-b87b80c59658",
  //         approvalId: null,
  //         companyGroupId: null,
  //         type: "ARRAY_NEW",
  //         fieldType: "ARRAY",
  //         fieldPath: "groups",
  //         timestamp: "2022-03-29T12:56:05.663Z",
  //         previousValue: "undefined",
  //         nextValue: "a5d56a1d-d3cc-4860-9cb8-beb36d9c0af9",
  //         groupId: "e6b99d61-565d-4b91-83ee-a804712e44a9",
  //         ownerId: "f8b40d70-06e6-4a39-9c65-3c0d30660850",
  //         server: null,
  //         ownerUserId: null,
  //         ownerThirdPartyId: null,
  //         fileUploadCandidatesId: null,
  //         companyId: "0aecf217-2b0b-44c3-b1d6-ce889296bf7b",
  //         attachmentId: null,
  //         ownerName: "Zoran Company Admin",
  //         ownerEmail: "zoran.kovacevic+ca@codecons.com",
  //         unknown: null,
  //         user: {
  //           createdAt: "2022-03-29T12:02:59.394Z",
  //           updatedAt: "2022-03-29T12:02:59.394Z",
  //           internalTags: [],
  //           id: "79725a72-de90-4a81-8b66-bd529f8e6011",
  //           email: "sveerashetty@enlil.com",
  //           name: "Shiv",
  //           confirmed: false,
  //           locked: false,
  //           passwordExpires: true,
  //           passwordLastEmailSentAt: null,
  //           passwordUpdatedAt: null,
  //           permissions: null,
  //           avatar: null,
  //           initialColor: "#c1f9ff",
  //           resetPasswordEmailTimestamp: null,
  //           resendConfirmationEmailTimestamp: null,
  //           forgotPasswordEmailTimestamp: null,
  //           passwordSetTimestamp: null,
  //         },
  //         employeeName: "Shiv",
  //       },
  //       {
  //         createdAt: "2022-03-29T12:30:54.289Z",
  //         updatedAt: "2022-03-29T12:30:54.289Z",
  //         internalTags: [],
  //         id: "1199230a-2724-4fff-a7d6-c11b746b4f68",
  //         changeRequestId: null,
  //         documentRevisionId: null,
  //         referenceId: null,
  //         employeeId: "e348ee87-6177-4328-8603-4c4f6e76685e",
  //         userId: "772335f4-1c5b-415f-a708-b87b80c59658",
  //         approvalId: null,
  //         companyGroupId: null,
  //         type: "ARRAY_DELETED",
  //         fieldType: "ARRAY",
  //         fieldPath: "groups",
  //         timestamp: "2022-03-29T12:30:54.308Z",
  //         previousValue: "a5d56a1d-d3cc-4860-9cb8-beb36d9c0af9",
  //         nextValue: "undefined",
  //         groupId: "32384fb3-8b59-47b0-bccc-5d8b3ce21423",
  //         ownerId: "08cbe301-46c9-4b1e-bd8b-29d69cb8d8f1",
  //         server: null,
  //         ownerUserId: null,
  //         ownerThirdPartyId: null,
  //         fileUploadCandidatesId: null,
  //         companyId: "0aecf217-2b0b-44c3-b1d6-ce889296bf7b",
  //         attachmentId: null,
  //         ownerName: "Zoran Company Admin",
  //         ownerEmail: "zoran.kovacevic+ca@codecons.com",
  //         unknown: null,
  //         user: {
  //           createdAt: "2022-03-29T12:02:59.394Z",
  //           updatedAt: "2022-03-29T12:02:59.394Z",
  //           internalTags: [],
  //           id: "79725a72-de90-4a81-8b66-bd529f8e6011",
  //           email: "sveerashetty@enlil.com",
  //           name: "Shiv",
  //           confirmed: false,
  //           locked: false,
  //           passwordExpires: true,
  //           passwordLastEmailSentAt: null,
  //           passwordUpdatedAt: null,
  //           permissions: null,
  //           avatar: null,
  //           initialColor: "#c1f9ff",
  //           resetPasswordEmailTimestamp: null,
  //           resendConfirmationEmailTimestamp: null,
  //           forgotPasswordEmailTimestamp: null,
  //           passwordSetTimestamp: null,
  //         },
  //         employeeName: "Shiv",
  //       },
  //       {
  //         createdAt: "2022-03-29T12:26:45.508Z",
  //         updatedAt: "2022-03-29T12:26:45.508Z",
  //         internalTags: [],
  //         id: "d0343d9e-e69d-4f2b-928f-26c7e5991035",
  //         changeRequestId: null,
  //         documentRevisionId: null,
  //         referenceId: null,
  //         employeeId: "e348ee87-6177-4328-8603-4c4f6e76685e",
  //         userId: null,
  //         approvalId: null,
  //         companyGroupId: null,
  //         type: "BOOLEAN_EDITED",
  //         fieldType: "BOOLEAN",
  //         fieldPath: "active",
  //         timestamp: "2022-03-29T12:26:45.512Z",
  //         previousValue: "false",
  //         nextValue: "true",
  //         groupId: "2fd2e188-2cc8-4fb0-a153-67f277aa7e16",
  //         ownerId: "f8b40d70-06e6-4a39-9c65-3c0d30660850",
  //         server: null,
  //         ownerUserId: null,
  //         ownerThirdPartyId: null,
  //         fileUploadCandidatesId: null,
  //         companyId: "0aecf217-2b0b-44c3-b1d6-ce889296bf7b",
  //         attachmentId: null,
  //         ownerName: "Zoran Company Admin",
  //         ownerEmail: "zoran.kovacevic+ca@codecons.com",
  //         unknown: null,
  //         employeeName: "Shiv",
  //       },
  //       {
  //         createdAt: "2022-03-29T12:26:08.875Z",
  //         updatedAt: "2022-03-29T12:26:08.875Z",
  //         internalTags: [],
  //         id: "31f84b9b-6a95-42a1-985a-f9d39f0daef9",
  //         changeRequestId: null,
  //         documentRevisionId: null,
  //         referenceId: null,
  //         employeeId: "e348ee87-6177-4328-8603-4c4f6e76685e",
  //         userId: null,
  //         approvalId: null,
  //         companyGroupId: null,
  //         type: "BOOLEAN_EDITED",
  //         fieldType: "BOOLEAN",
  //         fieldPath: "active",
  //         timestamp: "2022-03-29T12:26:08.894Z",
  //         previousValue: "true",
  //         nextValue: "false",
  //         groupId: "73801f35-780f-43a5-a8fe-867ca5242b1a",
  //         ownerId: "f248da38-fbf8-4b9e-8829-401350392b42",
  //         server: null,
  //         ownerUserId: null,
  //         ownerThirdPartyId: null,
  //         fileUploadCandidatesId: null,
  //         companyId: "0aecf217-2b0b-44c3-b1d6-ce889296bf7b",
  //         attachmentId: null,
  //         ownerName: "Zoran Company Admin",
  //         ownerEmail: "zoran.kovacevic+ca@codecons.com",
  //         unknown: null,
  //         employeeName: "Shiv",
  //       },
  //       {
  //         createdAt: "2022-03-29T12:02:59.394Z",
  //         updatedAt: "2022-03-29T12:02:59.394Z",
  //         internalTags: [],
  //         id: "ed9725c4-d7f3-4280-b72a-d53d2ce06c7c",
  //         changeRequestId: null,
  //         documentRevisionId: null,
  //         referenceId: null,
  //         employeeId: null,
  //         userId: "772335f4-1c5b-415f-a708-b87b80c59658",
  //         approvalId: null,
  //         companyGroupId: null,
  //         type: "STRING_NEW",
  //         fieldType: "STRING",
  //         fieldPath: "name",
  //         timestamp: "2022-03-29T12:02:59.406Z",
  //         previousValue: "undefined",
  //         nextValue: "Shiv",
  //         groupId: "7ae767b1-5a18-4e99-96e5-47799fe93c87",
  //         ownerId: "f8b40d70-06e6-4a39-9c65-3c0d30660850",
  //         server: null,
  //         ownerUserId: null,
  //         ownerThirdPartyId: null,
  //         fileUploadCandidatesId: null,
  //         companyId: "0aecf217-2b0b-44c3-b1d6-ce889296bf7b",
  //         attachmentId: null,
  //         ownerName: "Zoran Company Admin",
  //         ownerEmail: "zoran.kovacevic+ca@codecons.com",
  //         unknown: null,
  //       },
  //       {
  //         createdAt: "2022-03-29T12:02:59.394Z",
  //         updatedAt: "2022-03-29T12:02:59.394Z",
  //         internalTags: [],
  //         id: "d3c07d6b-7bbc-439e-a73c-ef8fb2cc67d1",
  //         changeRequestId: null,
  //         documentRevisionId: null,
  //         referenceId: null,
  //         employeeId: "e348ee87-6177-4328-8603-4c4f6e76685e",
  //         userId: null,
  //         approvalId: null,
  //         companyGroupId: null,
  //         type: "BOOLEAN_NEW",
  //         fieldType: "BOOLEAN",
  //         fieldPath: "active",
  //         timestamp: "2022-03-29T12:03:01.456Z",
  //         previousValue: "undefined",
  //         nextValue: "true",
  //         groupId: "7ae767b1-5a18-4e99-96e5-47799fe93c87",
  //         ownerId: "f8b40d70-06e6-4a39-9c65-3c0d30660850",
  //         server: null,
  //         ownerUserId: null,
  //         ownerThirdPartyId: null,
  //         fileUploadCandidatesId: null,
  //         companyId: "0aecf217-2b0b-44c3-b1d6-ce889296bf7b",
  //         attachmentId: null,
  //         ownerName: "Zoran Company Admin",
  //         ownerEmail: "zoran.kovacevic+ca@codecons.com",
  //         unknown: null,
  //         employeeName: "Shiv",
  //       },
  //       {
  //         createdAt: "2022-03-29T12:02:59.394Z",
  //         updatedAt: "2022-03-29T12:02:59.394Z",
  //         internalTags: [],
  //         id: "3ea641e2-f438-4ee1-8ea2-13a72619dbc6",
  //         changeRequestId: null,
  //         documentRevisionId: null,
  //         referenceId: null,
  //         employeeId: "e348ee87-6177-4328-8603-4c4f6e76685e",
  //         userId: null,
  //         approvalId: null,
  //         companyGroupId: null,
  //         type: "ARRAY_NEW",
  //         fieldType: "ARRAY",
  //         fieldPath: "groups",
  //         timestamp: "2022-03-29T12:03:01.456Z",
  //         previousValue: "undefined",
  //         nextValue: "a5d56a1d-d3cc-4860-9cb8-beb36d9c0af9",
  //         groupId: "7ae767b1-5a18-4e99-96e5-47799fe93c87",
  //         ownerId: "f8b40d70-06e6-4a39-9c65-3c0d30660850",
  //         server: null,
  //         ownerUserId: null,
  //         ownerThirdPartyId: null,
  //         fileUploadCandidatesId: null,
  //         companyId: "0aecf217-2b0b-44c3-b1d6-ce889296bf7b",
  //         attachmentId: null,
  //         ownerName: "Zoran Company Admin",
  //         ownerEmail: "zoran.kovacevic+ca@codecons.com",
  //         unknown: null,
  //         employeeName: "Shiv",
  //       },
  //       {
  //         createdAt: "2022-03-29T12:02:59.394Z",
  //         updatedAt: "2022-03-29T12:02:59.394Z",
  //         internalTags: [],
  //         id: "e7fcee54-1a70-4d68-8e69-a4d5308f497c",
  //         changeRequestId: null,
  //         documentRevisionId: null,
  //         referenceId: null,
  //         employeeId: "e348ee87-6177-4328-8603-4c4f6e76685e",
  //         userId: null,
  //         approvalId: null,
  //         companyGroupId: null,
  //         type: "ARRAY_NEW",
  //         fieldType: "ARRAY",
  //         fieldPath: "groups",
  //         timestamp: "2022-03-29T12:03:01.456Z",
  //         previousValue: "undefined",
  //         nextValue: "0a91f1f3-36aa-4a9e-b4d4-8d7e58b6afaf",
  //         groupId: "7ae767b1-5a18-4e99-96e5-47799fe93c87",
  //         ownerId: "f8b40d70-06e6-4a39-9c65-3c0d30660850",
  //         server: null,
  //         ownerUserId: null,
  //         ownerThirdPartyId: null,
  //         fileUploadCandidatesId: null,
  //         companyId: "0aecf217-2b0b-44c3-b1d6-ce889296bf7b",
  //         attachmentId: null,
  //         ownerName: "Zoran Company Admin",
  //         ownerEmail: "zoran.kovacevic+ca@codecons.com",
  //         unknown: null,
  //         employeeName: "Shiv",
  //       },
  //     ],
  //     total: 5,
  //   };

  //   const cardGroups = getCardGroups(data.results || [], page);
  //   setItems((prevState: NullableArray<AuditDetailsProps[]>) => [
  //     ...prevState,
  //     ...values(cardGroups),
  //   ] as NullableArray<AuditDetailsProps[]>);
  //   setPage((prevPageNumber) => prevPageNumber + limit);
  //   setIsLoading(false);
  // };
  const renderAuditRecords = () => (
    <>
      <div className={classes.externalContainer}>
        <div className={classes.titleOuterContainer}>
          <div className={classes.titleContainer}>
            <Text translation="document.revision.history" />
          </div>
          <div className={classes.iconContainer} >
            <IconButton
              color="default"
              onClick={() => closeDrawer()}
              aria-label="Close"
              id="histoy-closepanel"
              disableFocusRipple
              disableRipple
              disableTouchRipple
            >
              <CloseIcon style={{ color: Colors.gray }} />
            </IconButton>
          </div>
        </div>
      </div>
      <Box className={classes.listItemContainer}>
        {map(Items, (auditDetails, groupKey) => (
          <ListItem key={groupKey} disableGutters>
            {<Default auditDetails={auditDetails} />}
          </ListItem>)

        )}
      </Box>
    </>
  );

  return (
    <Drawer anchor="right" open={opendrawer.right} onClose={() => closeDrawer()}>
      <Box width={300}> {isLoading ? <LinearProgress /> : renderAuditRecords()}</Box>
      <LoadMoreButton onLoadMore={fetchAuditRecords}  id="historyLoadMore" />
    </Drawer>
  );
};

export default AuditItemPresenter;
