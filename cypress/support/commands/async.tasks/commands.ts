/* eslint-disable @typescript-eslint/no-namespace */

import { SQS_TYPES } from "../../../../src/ui/async.tasks/types";
import { CONFIG } from "../../config";
import { CyRoutes } from "../../routes";

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      asyncTaskSelectTaskType(params: {taskType: SQS_TYPES}): Chainable<Subject>;
      asyncTaskSelectNextTaskType(params: {taskType: SQS_TYPES}): Chainable<Subject>;
      asyncTaskClickSubmit(params?: {password?: string}): Chainable<Subject>;
      asyncSessionTaskClickSubmit(params?: {password?: string}): Chainable<Subject>;
      asyncSelectBackToTheFutureTime(params: {
        year?: number;
        month?: number;
        day?: number;
        hour?: number;
        minute?: number;
        seconds?: number; }): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("asyncTaskSelectTaskType", (params: {taskType: SQS_TYPES}) => {
  cy.get("#sqs-messages-type-select-outlined").arrowClick();
  cy.get("ul>li[role=option]").contains(params.taskType).arrowClick();
});

Cypress.Commands.add("asyncTaskSelectNextTaskType", (params: {taskType: SQS_TYPES}) => {
  cy.get(`div[data-cy="next.task"]`).arrowClick();
  cy.get("ul>li[role=option]").contains(params.taskType).arrowClick();
  cy.get("body").arrowType("{esc}");
});

Cypress.Commands.add("asyncSelectBackToTheFutureTime", (params: {
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  minute?: number;
  seconds?: number; }) => {
  if (params.year) { cy.get(`input[name="year"]`).arrowType( params.year.toString() ); }
  if (params.month) { cy.get(`input[name="month"]`).arrowType( params.month.toString() ); }
  if (params.day) { cy.get(`input[name="day"]`).clear().arrowType( params.day.toString() ); }
  if (params.hour) { cy.get(`input[name="hour"]`).arrowType( params.hour.toString() ); }
  if (params.minute) { cy.get(`input[name="minute"]`).arrowType( params.minute.toString() ); }
  if (params.seconds) { cy.get(`input[name="seconds"]`).arrowType( params.seconds.toString() ); }
});

Cypress.Commands.add("asyncTaskClickSubmit", (params: {password?: string}) => {
  const password = params?.password ? params.password : CONFIG.DEFAULT_ENLIL_USER_PASSWORD;

  cy.get(`button[type="submit"]`).arrowClick();
  cy.get(`input[name="password"]`).arrowType(password);
  cy.wrapWithWaitOnApiCall(CyRoutes.AsyncTasks, () => {
    cy.get(`button[data-cy="passwordConfirm"]`).arrowClick();
  });
});

Cypress.Commands.add("asyncSessionTaskClickSubmit", (params: {password?: string}) => {
  const password = params?.password ? params.password : CONFIG.DEFAULT_ENLIL_USER_PASSWORD;
  cy.get(`button[type="submit"]`).arrowClick();
  cy.get(`input[name="password"]`).arrowType(password);
  cy.wrapWithWaitOnApiCall(CyRoutes.AsyncSessionTasks, () => {
    cy.get(`button[data-cy="passwordConfirm"]`).arrowClick();
  });
});

export { };
