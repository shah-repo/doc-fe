/* eslint-disable react/jsx-key */
import React from "react";
import ApprovalRolesPresenter from "./ApprovalRoles.presenter";

interface Props {
  activeEmployees: any;
  groupOptions: any;
}

const roles = {
  approvalRoles: [
    {
      id: "991a4ceb-e0f3-43b8-8776-49165b63a46f",
      employees: [
        {
          createdAt: "2020-03-27T11:12:20.202Z",
          updatedAt: "2020-03-27T11:12:20.202Z",
          id: "9ca17461-e79c-457a-97ba-906a2e1ed885",
          active: true,
          slackUserId: null,
          user: {
            createdAt: "2020-03-27T11:12:20.202Z",
            updatedAt: "2020-03-27T11:12:51.989Z",
            id: "688f2410-4256-4f84-a8a7-91721555d3f4",
            email: "ivan.veselin+4@codecons.com",
            name: "Ivan the Fourth",
            confirmed: true,
            permissions: null,
            avatar: null,
          },
        },
      ],
      groups: [
        {
          name: "First Group",
          id: "12345abcd",
        },
      ],
      name: "Sr. QA",
      index: 0,
    },
    {
      id: "c686609b-b2d3-4d33-8a96-6beea5ba1d4f",
      employees: [
        {
          createdAt: "2020-03-27T10:34:03.201Z",
          updatedAt: "2020-03-27T10:34:03.201Z",
          id: "573bc603-501e-4cc5-ad4e-92aa4f2e1896",
          active: true,
          slackUserId: null,
          user: {
            createdAt: "2019-11-15T09:31:59.204Z",
            updatedAt: "2019-11-15T09:31:59.204Z",
            id: "04867f31-9ff1-483e-8f80-94d47530e0bc",
            email: "ivan.veselin+3@codecons.com",
            name: "Ivan the Third",
            confirmed: true,
            permissions: null,
            avatar: null,
          },
        },
      ],
      groups: [
        {
          name: "Second Group",
          id: "12345abcd",
        },
      ],
      name: "Sr. Engineer",
      index: 1,
    },
    {
      id: "da51950b-2573-4577-be7c-ba3f42b5ac64",
      employees: [
        {
          createdAt: "2020-03-27T11:12:20.202Z",
          updatedAt: "2020-03-27T11:12:20.202Z",
          id: "9ca17461-e79c-457a-97ba-906a2e1ed885",
          active: true,
          slackUserId: null,
          user: {
            createdAt: "2020-03-27T11:12:20.202Z",
            updatedAt: "2020-03-27T11:12:51.989Z",
            id: "688f2410-4256-4f84-a8a7-91721555d3f4",
            email: "ivan.veselin+4@codecons.com",
            name: "Ivan the Fourth",
            confirmed: true,
            permissions: null,
            avatar: null,
          },
        },
        {
          createdAt: "2020-03-27T10:34:03.201Z",
          updatedAt: "2020-03-27T10:34:03.201Z",
          id: "691faa7c-9c48-4a5a-8ab3-d633015288a6",
          active: true,
          slackUserId: null,
          user: {
            createdAt: "2019-11-15T09:31:59.204Z",
            updatedAt: "2019-11-15T09:31:59.204Z",
            id: "e0140d81-20c6-4b37-8d3f-e4a4664aee59",
            email: "ivan.veselin+2@codecons.com",
            name: "Ivan the Second",
            confirmed: true,
            permissions: null,
            avatar: null,
          },
        },
        {
          createdAt: "2020-03-27T10:34:03.201Z",
          updatedAt: "2020-03-27T10:34:03.201Z",
          id: "ab82af5e-f9d5-42be-a761-f57893fd3887",
          active: true,
          slackUserId: null,
          user: {
            createdAt: "2019-11-15T09:31:59.204Z",
            updatedAt: "2019-11-15T09:31:59.204Z",
            id: "7299f9d6-d1d3-4afe-8749-8f5184ea4f7a",
            email: "ivan.veselin+1@codecons.com",
            name: "Ivan the First",
            confirmed: true,
            permissions: null,
            avatar: null,
          },
        },
        {
          createdAt: "2020-03-27T10:34:03.201Z",
          updatedAt: "2020-03-27T10:34:03.201Z",
          id: "573bc603-501e-4cc5-ad4e-92aa4f2e1896",
          active: true,
          slackUserId: null,
          user: {
            createdAt: "2019-11-15T09:31:59.204Z",
            updatedAt: "2019-11-15T09:31:59.204Z",
            id: "04867f31-9ff1-483e-8f80-94d47530e0bc",
            email: "ivan.veselin+3@codecons.com",
            name: "Ivan the Third",
            confirmed: true,
            permissions: null,
            avatar: null,
          },
        },
      ],
      groups: [
        {
          name: "Third Group",
          id: "12345abcd",
        },
      ],
      name: "R&D",
      index: 2,
    },
    {
      id: "9b21d78f-39ae-4909-a1d3-8213d9f74c02",
      employees: [
        {
          createdAt: "2020-03-27T11:12:20.202Z",
          updatedAt: "2020-03-27T11:12:20.202Z",
          id: "9ca17461-e79c-457a-97ba-906a2e1ed885",
          active: true,
          slackUserId: null,
          user: {
            createdAt: "2020-03-27T11:12:20.202Z",
            updatedAt: "2020-03-27T11:12:51.989Z",
            id: "688f2410-4256-4f84-a8a7-91721555d3f4",
            email: "ivan.veselin+4@codecons.com",
            name: "Ivan the Fourth",
            confirmed: true,
            permissions: null,
            avatar: null,
          },
        },
        {
          createdAt: "2020-03-27T10:34:03.201Z",
          updatedAt: "2020-03-27T10:34:03.201Z",
          id: "691faa7c-9c48-4a5a-8ab3-d633015288a6",
          active: true,
          slackUserId: null,
          user: {
            createdAt: "2019-11-15T09:31:59.204Z",
            updatedAt: "2019-11-15T09:31:59.204Z",
            id: "e0140d81-20c6-4b37-8d3f-e4a4664aee59",
            email: "ivan.veselin+2@codecons.com",
            name: "Ivan the Second",
            confirmed: true,
            permissions: null,
            avatar: null,
          },
        },
      ],
      groups: [
        {
          name: "Fourth Group",
          id: "12345abcd",
        },
      ],
      name: "QA",
      index: 3,
    },
    {
      id: "bd4872c5-b41e-4eb2-a487-0c47ee5d40f3",
      employees: [
        {
          createdAt: "2020-03-27T10:34:03.201Z",
          updatedAt: "2020-03-27T10:34:03.201Z",
          id: "ab82af5e-f9d5-42be-a761-f57893fd3887",
          active: true,
          slackUserId: null,
          user: {
            createdAt: "2019-11-15T09:31:59.204Z",
            updatedAt: "2019-11-15T09:31:59.204Z",
            id: "7299f9d6-d1d3-4afe-8749-8f5184ea4f7a",
            email: "ivan.veselin+1@codecons.com",
            name: "Ivan the First",
            confirmed: true,
            permissions: null,
            avatar: null,
          },
        },
        {
          createdAt: "2020-03-27T10:34:03.201Z",
          updatedAt: "2020-03-27T10:34:03.201Z",
          id: "573bc603-501e-4cc5-ad4e-92aa4f2e1896",
          active: true,
          slackUserId: null,
          user: {
            createdAt: "2019-11-15T09:31:59.204Z",
            updatedAt: "2019-11-15T09:31:59.204Z",
            id: "04867f31-9ff1-483e-8f80-94d47530e0bc",
            email: "ivan.veselin+3@codecons.com",
            name: "Ivan the Third",
            confirmed: true,
            permissions: null,
            avatar: null,
          },
        },
      ],
      groups: [
        {
          name: "Fifth Group",
          id: "12345abcd",
        },
      ],
      name: "Engingeering",
      index: 4,
    },
    {
      id: "6f0d4c60-3a4e-4c7b-b380-79edb00259b2",
      employees: [
        {
          createdAt: "2020-03-27T10:34:03.201Z",
          updatedAt: "2020-03-27T10:34:03.201Z",
          id: "f85b3816-8c98-4698-a325-a17370382156",
          active: true,
          slackUserId: null,
          user: {
            createdAt: "2020-03-27T10:34:03.201Z",
            updatedAt: "2020-03-27T10:37:51.859Z",
            id: "3d52f2e6-69fd-4bf6-98cc-964ceb2957d9",
            email: "ivan.veselin+special@codecons.com",
            name: "Ivan the CEO",
            confirmed: true,
            permissions: null,
            avatar: null,
          },
        },
      ],
      groups: [
      ],
      name: "CEO",
      index: 5,
    },
  ],
};
const ApprovalRolesContainer: React.FunctionComponent<Props> = ({
  activeEmployees,
  groupOptions,
}) => {

  const approvalRolesRenderer = () => (
    roles.approvalRoles.map((role, index) => {
      const isWithoutBorder = index === (roles.approvalRoles.length - 1);

      return <ApprovalRolesPresenter
        name={role.name}
        groups={role.groups}
        employees={role.employees}
        employeeOptions={activeEmployees}
        groupOptions={groupOptions}
        isWithoutBorder={isWithoutBorder}
      />;
    })
  );

  return (
    <>
      {approvalRolesRenderer()}
    </>
  ); };

export default ApprovalRolesContainer;
