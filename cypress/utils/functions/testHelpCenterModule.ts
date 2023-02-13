// / <reference types="cypress" />

import { HelpCenterItemType, HelpCenterModuleData } from "../../../src/App/Enlil/Features/HelpCenter/HelpCenter.types";

export function testHelpCenterModule(moduleData?: HelpCenterModuleData, params?: { withDocuments?: boolean }) {
  context(
    "Verify that Help button is visible on the top global header of the landing page beside the Settings button",
    () => {
      it("Should be visible on all the landing pages", () => {
        cy.get("[data-cy='help-center.opener']").should("be.visible");
      });
    }
  );

  context("Click on the Help button", () => {
    it("Should open a Help modal dropdown menu on the right side", () => {
      cy.openHelpCenterNavigation();
    });

    context("Should contain the following options:", () => {
      it("Help Guides", () => {
        cy.get("[data-cy='help-center.navigation']", { timeout: 500 })
          .contains("[role='menuitem']", "Help Guides").should("be.visible");

        if (!moduleData) {
          cy.get("[data-cy='help-center.content-opener']", { timeout: 500 }).checkExternalLink();
        }
      });
      it("Release Notes", () => {
        cy.get("[data-cy='help-center.navigation']", { timeout: 500 })
          .contains("[role='menuitem']", "Release Notes").should("be.visible")
          .closest("a").checkExternalLink();
      });
      it("FAQs", () => {
        cy.get("[data-cy='help-center.navigation']", { timeout: 500 })
          .contains("[role='menuitem']", "FAQs").should("be.visible")
          .closest("a").checkExternalLink();
      });
      it("Contact Us", () => {
        cy.get("[data-cy='help-center.navigation']", { timeout: 500 })
          .contains("[role='menuitem']", "Contact Us").should("be.visible")
          .closest("a").checkExternalLink();
      });
    });
  });

  if (moduleData) {
    context("Click the Help Guide", () => {
      it("Should open a bigger modal", () => {
        cy.openHelpCenterContent();
      });
      context("Should display the following:", () => {
        it("Module or Menu label", () => {
          cy.verifyHelpCenterTitle(moduleData.title);
        });
        it("Link to Full Guide", () => {
          cy.verifyHelpCenterFullGuideLink();
        });

        context(
          "Verify that all contents, links and labels follows the Help Guides Content Deck",
          () => {

            context(
              `Should be able to click on other links within the help guides
              and this links should open on a new tab`,
              () => {
                const howToItems = moduleData.items.filter((item) => item.url === HelpCenterItemType.HowTo);
                if (howToItems.length) {
                  it("HowTo Label and URL", () => {
                    cy.get("[data-cy='help-center.howto-item']")
                      .should("have.length", howToItems.length)
                      .then((links) => {
                        cy.wrap(links).each((link, index) => {
                          cy.wrap(link).should("have.text", howToItems[index].title)
                            .closest("a").checkExternalLink();
                        });
                      });
                  });
                }

                const workflowItems = moduleData.items.filter((item) => item.url === HelpCenterItemType.Workflow);
                if (workflowItems.length) {
                  it("Workflow Label and URL", () => {
                    cy.get("[data-cy='help-center.workflow-item']")
                      .should("have.length", workflowItems.length)
                      .then((links) => {
                        cy.wrap(links).each((link, index) => {
                          cy.wrap(link).should("have.text", workflowItems[index].title)
                            .closest("a").checkExternalLink();
                        });
                      });
                  });
                }

                const videoItems = moduleData.items.filter((item) => item.url === HelpCenterItemType.Video);
                if (videoItems.length) {
                  it("Video embed", () => {
                    cy.get("[data-cy='help-center.video-item']")
                      .should("have.length", workflowItems.length)
                      .then((videos) => {
                        cy.wrap(videos).each((video) => {
                          cy.wrap(video)
                            .find("iframe").its("0.contentDocument.body").should("not.be.empty");
                        });
                      });
                  });
                }
              }
            );
          }
        );
      });

      context(
        "The options below should be shown under Other Popular Resources",
        () => {
          context("Clicking on this links should also open the pages below in a new tab", () => {
            it("Release Notes", () => {
              cy.get("[data-cy='help-center.popular.release-notes']")
                .should("be.visible").checkExternalLink();
            });
            it("FAQS", () => {
              cy.get("[data-cy='help-center.popular.faqs']")
                .should("be.visible").checkExternalLink();
            });
            it("View All Guides ", () => {
              cy.get("[data-cy='help-center.popular.guides']")
                .should("be.visible").checkExternalLink();
            });
            it("Contact Us", () => {
              cy.get("[data-cy='help-center.contact.contact']")
                .should("be.visible").checkExternalLink();
            });
          });
        }
      );
    });

    if (params?.withDocuments) {
      context("The Help modal (Help Guides option) should always stay open within the module", () => {
        context(
          `If the user clicks on the Help Guides option while in the landing page,
          the Help modal should be displayed even if the user opens a line item or vise versa`,
          () => {
            it("Verify HelpCenter state", () => {
              cy.verifyHelpCenterTitle(moduleData.title);
            });

            it("Open line item", () => {
              cy.dlClearFilters();
              cy.dlSelectFirstDocumentItem();
            });

            it("Verify HelpCenter state", () => {
              cy.verifyHelpCenterTitle(moduleData.title);
            });

            it("Go back in browser", () => {
              cy.go("back");
            });

            it("Verify HelpCenter state", () => {
              cy.verifyHelpCenterTitle(moduleData.title);
            });
          }
        );
      });
    }

    context(
      `If the user clicks away from the module, then the Help modal should automatically close`,
      () => {
        it("Navigate to Page Details Management", () => {
          cy.navigToPageDetailsManagement();
        });
        it("Verify that HelpCenter is closed", () => {
          cy.checkIfHelpCenterClosed();
        });
      }
    );

    context(
      `The user should have an option to close the modal at any point`,
      () => {
        context("Navigation close", () => {
          it("Navigate to Dashboard", () => {
            cy.navigToDashboardWithoutApi();
          });
          it("Open HelpCenter navigation", () => {
            cy.openHelpCenterNavigation();
          });
          it("Close HelpCenter navigation", () => {
            cy.closeHelpCenterNavigation();
          });
        });
        context("Content close", () => {
          it("Open HelpCenter navigation", () => {
            cy.openHelpCenterNavigation();
          });

          it("Open HelpCenter content", () => {
            cy.openHelpCenterContent();
          });

          it("Close HelpCenter content", () => {
            cy.closeHelpCenterContent();
          });

          it("Verify HelpCenter navigation visibility", () => {
            cy.get("[data-cy='help-center.navigation'", { timeout: 500 }).should("not.exist");
          });
        });
      }
    );
  }

  context("Click Release Note", () => {
    context("Way 1: navigation", () => {
      it("Open HelpCenter navigation", () => {
        cy.openHelpCenterNavigation();
      });
      it("Verify Release Notes", () => {
        cy.get("[data-cy='help-center.release-notes']")
          .should("be.visible").checkExternalLink();
      });
    });

    context("Way 2: modal", () => {
      it("Open HelpCenter content", () => {
        cy.openHelpCenterContent();
      });
      it("Verify Release Notes", () => {
        cy.get("[data-cy='help-center.popular.release-notes']")
          .should("be.visible").checkExternalLink();
      });
      it("Close HelpCenter content", () => {
        cy.closeHelpCenterContent();
      });
    });
  });

  context("Click FAQS", () => {
    context("Way 1: navigation", () => {
      it("Open HelpCenter navigation", () => {
        cy.openHelpCenterNavigation();
      });
      it("Verify FAQS", () => {
        cy.get("[data-cy='help-center.faqs']")
          .should("be.visible").checkExternalLink();
      });
    });

    context("Way 2: modal", () => {
      it("Open HelpCenter content", () => {
        cy.openHelpCenterContent();
      });
      it("Verify FAQS", () => {
        cy.get("[data-cy='help-center.popular.faqs']")
          .should("be.visible").checkExternalLink();
      });
      it("Close HelpCenter content", () => {
        cy.closeHelpCenterContent();
      });
    });
  });

  context("Click on Contact Us", () => {
    context("Way 1: navigation", () => {
      it("Open HelpCenter navigation", () => {
        cy.openHelpCenterNavigation();
      });
      it("Verify Contact Us", () => {
        cy.get("[data-cy='help-center.contact']")
          .should("be.visible").checkExternalLink();
      });
    });

    context("Way 2: modal", () => {
      it("Open HelpCenter content", () => {
        cy.openHelpCenterContent();
      });
      it("Verify Contact Us", () => {
        cy.get("[data-cy='help-center.contact.contact']")
          .should("be.visible").checkExternalLink();
      });
      it("Close HelpCenter content", () => {
        cy.closeHelpCenterContent();
      });
    });
  });
}
