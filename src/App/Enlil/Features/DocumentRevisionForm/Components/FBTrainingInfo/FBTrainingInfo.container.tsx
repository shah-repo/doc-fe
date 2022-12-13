import axios, { AxiosRequestConfig, CancelTokenSource } from "axios";
import { groupBy } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import apiClient from "../../../../../../state/apiClient";
import { DocumentRevisionStatus } from "../../../../../../state/ducks/documentRevisions/types";
import { TRAINING_RECORDS_SEARCH_URL } from "../../../../../../state/ducks/training/constants";
import { store } from "../../../../../../state/store";
import FBTrainingInfoPresenter from "./FBTrainingInfo.presenter";
import { GroupByStateProps, TrainingItem, TrainingStates } from "./FBTrainingInfo.types";

interface TrainingInfoContainerProps {
  documentRevisionId?: string;
  docRevStatus: DocumentRevisionStatus;
}

let call: CancelTokenSource;

const FBTrainingInfoContainer: React.FunctionComponent<
  TrainingInfoContainerProps
> = ({ documentRevisionId, docRevStatus }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [trainingData, setTrainingData] = useState<GroupByStateProps>({});

  const queryApi = useCallback(() => {
    setIsLoading(true);
    call?.cancel();
    call = axios.CancelToken.source();
    const requestConfig: AxiosRequestConfig = {
      method: "post",
      url: TRAINING_RECORDS_SEARCH_URL,
      data: {
        filters: [
          {
            field: "documentRevision.id",
            operator: "eq",
            value: documentRevisionId,
          },
        ],
        schema: [
          {
            trainingPlan: {
              employee: {
                user: {
                  name: true,
                  email: true,
                  avatar: true,
                  initialColor: true,
                },
              },
            },
            completedAt: true,
            completedAtAfter: true,
            dueOn: true,
          },
        ],
      },
      params: {},
      headers: {},
      cancelToken: call.token,
    };

    requestConfig.headers.Authorization = `bearer ${
      store.getState().auth.user.employeeId
    }:${store.getState().auth.user.sessionId}`;

    apiClient
      .request(requestConfig)
      .then((resp) => resp)
      .then(({ data }) => {
        const processedData = data.results.map((el) => ({
          name: el.trainingPlan.employee.user.name,
          email: el.trainingPlan.employee.user.email,
          avatar: el.trainingPlan.employee.user.avatar,
          initialColor: el.trainingPlan.employee.user.initialColor,
          state: el.completedAt ? TrainingStates.COMPLETED : TrainingStates.PENDING,
          dueOn: el.dueOn,
          completedAt: el.completedAt,
        }));
        if (processedData.length > 0) {
          processTrainingData(processedData);
        } else {
          setTrainingData({});
        }
        setIsLoading(false);
      })
      .catch((exception) => {
        setIsLoading(false);
        if (axios.isCancel(exception)) {
          return;
        }
      });
  }, [documentRevisionId]);

  useEffect(() => {
    queryApi();
  }, [documentRevisionId, queryApi]);

  const processTrainingData = (data: TrainingItem) => {
    const groupData = groupBy(data, "state");
    const obj = {};
    Object.keys(groupData)
      .reverse()
      .forEach((el: string) => {
        obj[el] = {
          data: groupData[el],
          title: el,
        };
      });
    setTrainingData(obj);
  };

  return (
    <FBTrainingInfoPresenter
      trainingData={trainingData}
      docRevStatus={docRevStatus}
      isLoading={isLoading}
    />
  );
};

export default FBTrainingInfoContainer;
