export const approversResponse = {
  optionalApprovers: [
    {
      createdAt: "2019-12-12T22:58:50.295Z",
      updatedAt: "2019-12-12T22:58:50.295Z",
      id: "f56104f5-fc93-46aa-a404-6fd399528adf",
      active: true,
      slackUserId: null,
      user: {
        createdAt: "2019-11-05T13:00:19.508Z",
        updatedAt: "2020-01-10T20:39:22.584Z",
        id: "958339e0-791a-4a5f-87ba-c3f61e59d587",
        email: "zsalahieh@shifamed.com",
        name: "Zahra Shifamed",
        permissions: null,
        avatar: "https://doc-be-dev-public.s3.us-west-2.amazonaws.com/9ea4f9be-ea42-40ff-b507-77597ff202a8/2020-01-10T20%3A39%3A21.883Z_Blue%20Sky%20image.jpg",
      },
      groups: [
        {
          createdAt: "2019-12-13T14:26:39.936Z",
          updatedAt: "2020-01-24T11:27:05.492Z",
          id: "db126f0c-a23e-48c4-916f-1c9b4e27b7a9",
          name: "Slack Group",
          permissions: [
            "SLACK_APP_INSTALL",
          ],
          defaultForNewUsers: false,
          tags: null,
        },
        {
          createdAt: "2019-11-19T07:35:28.952Z",
          updatedAt: "2020-01-26T13:46:00.314Z",
          id: "a20a6714-502f-4585-94db-3cb1134a2951",
          name: "Can be approver",
          permissions: [
            "CR_ON_APPROVER_LIST",
          ],
          defaultForNewUsers: true,
          tags: null,
        },
        {
          createdAt: "2019-12-04T15:25:15.502Z",
          updatedAt: "2020-01-24T11:27:05.492Z",
          id: "082a1f68-6e68-4133-ab24-43eb25800e4c",
          name: "Management Group",
          permissions: [
            "USERS_GET",
            "USERS_CREATE",
            "USERS_UPDATE",
            "EMPLOYEE_GET",
            "EMPLOYEE_CREATE",
            "EMPLOYEE_UPDATE",
            "EMPLOYEE_DELETE",
            "GROUP_GET",
            "GROUP_UPDATE",
          ],
          defaultForNewUsers: false,
          tags: [
            "USER_MANAGEMENT",
          ],
        },
      ],
    },
  ],
};
