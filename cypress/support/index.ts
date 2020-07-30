// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "cypress-file-upload";
import "cypress-promise/register";
import "cypress-xpath";
import "./commands";
import "./commands/attachments/commands";
import "./commands/auth/commands";
import "./commands/change.request/commands";
import "./commands/company/commands";
import "./commands/document.revision/commands";
import "./commands/group.management/commands";
// Alternatively you can use CommonJS syntax:
// require('./commands')
