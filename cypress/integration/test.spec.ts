// / <reference types="cypress-downloadfile"/>

import { USERS } from "../utils/constants/users";
context("Helper test", () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  context("Login user", () => {
    it("Logs user in", () => {
      cy.authLogin({
        email: USERS[2].email,
        password: "Tester1!",
      });
    });

    it("Selects company", () => {
      cy.cmpSelectCompany({ name: "Silver Gislason - Nader 76236", multiple: true });
    });
  });

  context("Navig to doc, test download", () => {
    it("Navigate to document", () => {
      cy.visit("http://localhost:5602/document_revision/3aebc48e-62bd-452a-9685-e3e319362aa5/version/d7473645-86b3-4e60-9865-0b75803b183b");
    });

    // it("Navigate to asdfas", () => {
    //   cy.downloadFile({
    //     url: "https://doc-be-dev.s3.us-west-2.amazonaws.com/e49ae8fe-4b99-4c76-8476-ad6427c1989a/2020-10-27T14%3A08%3A02.981Z/image.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIA34PPWAQBXIR4H36P%2F20201027%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20201027T145532Z&X-Amz-Expires=600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIG1od%2BzVEExjjmDYLIgrtgVZncMfByAbKG%2FQJwkhLpE7AiAl4r3D3N%2BJx%2FAbVdLaC8xBmYp0YzX4RsgX4BY%2Bnn3PcyrvAQgQEAEaDDgxNzA4MzMxOTI5OSIM2Ixs0eX3XxFGg0weKswBspOgrsK57gp5%2FD0yyNb6BSlZ0N1uL%2FZLqb2stiwXu3MhPgoxNLyEhFNpZ6KgkqBOYK%2B7Fn%2FMLktaeMUus2nJ1JsK%2F9ABUBteOMf12tLZm%2BoiebYGXA%2FUy3BoaXD3%2BweXhrxsIOI2R8pFu4IOBmz6BoLG9qIFVP%2Bt1aVEv9T%2Ff5f0gTylUwTuPCYHMQjA8E32hHiyMsZC9N7vAvDAmA72M8lttzcnKa3%2FGPmxU4dEVg7vccofrDU4xV1iS8NI7U9a1yEd%2BI6zkGm5qoMdMPKN3%2FwFOpkBxFmg06iXuKVhtscXgFnRvifpzZl9aKht15E2t11kb8F7EsShY25nMPCJiXFBs2LR5%2FnSnanEai71AKX6%2BEKZ02p3xW%2BQXx%2BwyLJT0BOEVxgIGy2iG3uwVjE%2FOEBZM%2FZDr1uUWeQOw3ea%2Bfub%2Frw%2FZE6xYC4zuXHAzPho0xg2Iw%2FdTaOS0iQ51LVXDCVr%2FkH9BAnM%2FyVnarGY&X-Amz-Signature=6d7422cc193d4ba344ec9c45e37b345d165d84a8ba18b069e69445424e1648b9&X-Amz-SignedHeaders=host",
    //     directory: "cypress/downloads",
    //     fileName: "example.jpg",
    //   });
    // });

    // it("Click download", () => {
    //   cy.server();
    //   cy.route({
    //     method: "GET",
    //     url: "/api/v1/attachments/*/download*",
    //     onResponse: (xhr) => {
    //       console.log(xhr);
    //       xhr.response.body = "[test]";
    //       return xhr;
    //     },
    //   })
    //     .as("attach");
    //   cy.get("div[data-cy=\"attachment\"]:nth-child(1)").rightclick();
    //   cy.get("div[id=\"simple-menu\"]>div>ul[role=\"menu\"]>li:nth-child(1)").click();
    //   // cy.wait("@attach").its("request.body").should("include", "user");
    // });

    it("Click download", () => {
      cy.atchDownloadFile({ fileName: "test.docx" });
    });

    it("Navigate to document", () => {
      cy.wait(3000);
    });
  });
});
