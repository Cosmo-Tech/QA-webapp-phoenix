import 'cypress-file-upload';
const connection = require('../../../functions/connect.cy.js');
const datasetManager = require('../../../functions/datasetManager.cy.js');
const config = require('../../../../variables.cy.js');
const scenario = require('../../../functions/scenario.cy.js');

describe('Scenario Manager feature', () => {
  it('PROD-13878: Edit a scenario', () => {
    connection.connect();
    // Remove scenarios in case it's a second try
    scenario.deleteScenario('Updated-DLOP-PROD-13878');
    scenario.deleteScenario('DLOP-PROD-13878-EditName');

    // Create the scenario that will be used for the edition tests.
    // To test all the fiels, a description and a tag is needed, so the createfunction won't be used to add the description and tag (not included in the create function)
    connection.navigate('scenario-view');
    cy.get('[data-cy="create-scenario-button"]').click({ force: true });
    cy.get('#scenarioName').click().type('DLOP-PROD-13878-EditName');
    cy.get('[data-cy="create-scenario-dialog-master-checkbox"]').click({ force: true });
    cy.get('[placeholder="Select a dataset"]').click().clear().type('DLOP-Reference-for-automated-tests').type('{downarrow}{enter}');
    cy.get('[id="scenarioType"]').click({ force: true });
    cy.get('[id="scenarioType"]').click().clear().type('Run template with Brewery parameters').type('{downarrow}{enter}');
    cy.get('[data-cy="text-input-new-scenario-description"]').click({ force: true }).clear().type('Description before edition');
    cy.get('[id="new-scenario-tags"]')
      .click({ force: true })
      .clear()
      .type('FirstTag' + '{enter}');
    // Validate the scenario creation
    cy.get('[data-cy="create-scenario-dialog-submit-button"]').click({ force: true });
    cy.wait(1000);

    // Edit the name of the scenario
    connection.navigate('manager');
    scenario.searchScenarioInManager('DLOP-PROD-13878-EditName');
    cy.get('[data-testid="EditIcon"]').click();
    cy.wait(1000);
    cy.get('[placeholder="Scenario name"]')
      .click()
      .clear()
      .type('Updated-DLOP-PROD-13878' + '{enter}');

    // Check the new name is persistant
    scenario.searchScenarioInManager('Updated-DLOP-PROD-13878');
    scenario.shareScenarioWithUser('Updated-DLOP-PROD-13878', config.permissionUserEmail(), config.permissionUserName(), 'admin');

    // Try special character and check there is no error message display
    cy.get('[data-testid="EditIcon"]').click();
    cy.wait(1000);
    cy.get('[placeholder="Scenario name"]').click().clear().type('?');
    cy.get('[data-cy^="scenario-accordion-"]').should('not.contain', 'Scenario name has to start with a letter or a digit, and can only contain letters, digits, spaces, underscores, hyphens and dots.');
    cy.get('[placeholder="Scenario name"]').click().clear().type('$');
    cy.get('[data-cy^="scenario-accordion-"]').should('not.contain', 'Scenario name has to start with a letter or a digit, and can only contain letters, digits, spaces, underscores, hyphens and dots.');
    cy.get('[placeholder="Scenario name"]').click().clear().type('%');
    cy.get('[data-cy^="scenario-accordion-"]').should('not.contain', 'Scenario name has to start with a letter or a digit, and can only contain letters, digits, spaces, underscores, hyphens and dots.');
    cy.get('[placeholder="Scenario name"]').click().clear().type('é');
    cy.get('[data-cy^="scenario-accordion-"]').should('not.contain', 'Scenario name has to start with a letter or a digit, and can only contain letters, digits, spaces, underscores, hyphens and dots.');
    cy.get('[placeholder="Scenario name"]').click().clear().type('#');
    cy.get('[data-cy^="scenario-accordion-"]').should('not.contain', 'Scenario name has to start with a letter or a digit, and can only contain letters, digits, spaces, underscores, hyphens and dots.');
    cy.get('[placeholder="Scenario name"]').click().clear().type('€');
    cy.get('[data-cy^="scenario-accordion-"]').should('not.contain', 'Scenario name has to start with a letter or a digit, and can only contain letters, digits, spaces, underscores, hyphens and dots.');
    cy.get('[placeholder="Scenario name"]').click().clear().type('@');
    cy.get('[data-cy^="scenario-accordion-"]').should('not.contain', 'Scenario name has to start with a letter or a digit, and can only contain letters, digits, spaces, underscores, hyphens and dots.');
    cy.get('[placeholder="Scenario name"]').click().clear().type('(');
    cy.get('[data-cy^="scenario-accordion-"]').should('not.contain', 'Scenario name has to start with a letter or a digit, and can only contain letters, digits, spaces, underscores, hyphens and dots.');
    cy.get('[placeholder="Scenario name"]').click().clear().type('&');
    cy.get('[data-cy^="scenario-accordion-"]').should('not.contain', 'Scenario name has to start with a letter or a digit, and can only contain letters, digits, spaces, underscores, hyphens and dots.');
    cy.get('[placeholder="Scenario name"]').click().clear().type('+');
    cy.get('[data-cy^="scenario-accordion-"]').should('not.contain', 'Scenario name has to start with a letter or a digit, and can only contain letters, digits, spaces, underscores, hyphens and dots.');
    cy.get('[placeholder="Scenario name"]').click().clear().type('ç');
    cy.get('[data-cy^="scenario-accordion-"]').should('not.contain', 'Scenario name has to start with a letter or a digit, and can only contain letters, digits, spaces, underscores, hyphens and dots.');
    cy.get('[placeholder="Scenario name"]').click().clear().type('"');
    cy.get('[data-cy^="scenario-accordion-"]').should('not.contain', 'Scenario name has to start with a letter or a digit, and can only contain letters, digits, spaces, underscores, hyphens and dots.');
    cy.get('[placeholder="Scenario name"]').click().clear().type('{enter}');

    // Check the name has not been updated after validation
    scenario.searchScenarioInManager('Updated-DLOP-PROD-13878');

    // Try to empty the scenario name
    cy.get('[data-testid="EditIcon"]').click();
    cy.wait(1000);
    cy.get('[placeholder="Scenario name"]').click().clear();
    cy.get('[data-cy^="scenario-accordion-"]').should('contain', 'Scenario name cannot be empty');
    cy.get('[placeholder="Scenario name"]').click().clear().type('{enter}');

    // Check the name has not been updated after validation
    scenario.searchScenarioInManager('Updated-DLOP-PROD-13878');

    // Create a new scenario, then try to rename one like the other (unique name, so can't do that)
    // Same name as the previous one is used to check the original name is available after edition.
    scenario.createScenario('DLOP-PROD-13878-EditName', 'master', 'DLOP-Reference-for-automated-tests', 'BreweryParameters');
    connection.navigate('manager');
    scenario.searchScenarioInManager('Updated-DLOP-PROD-13878');
    cy.get('[data-testid="EditIcon"]').click();
    cy.wait(1000);
    cy.get('[placeholder="Scenario name"]').click().clear().type('DLOP-PROD-13878-EditName');
    cy.get('[data-cy^="scenario-accordion-"]').should('contain', 'Scenario name already exists');

    // Check the name has not been updated after validation
    scenario.searchScenarioInManager('Updated-DLOP-PROD-13878');

    // Unfold the card
    cy.get('[data-testid="UnfoldMoreIcon"]').click();
    // Update the description
    cy.get('[data-cy="scenario-description-disabled"]').click();
    cy.wait(500);
    cy.get('[id="description-input"]').clear().type('Updated Description');
    // Click anywhere else to validate the update
    cy.get('[data-cy="scenario-run-template"]').click();
    // Check only new description is displayed
    cy.get('[data-cy="scenario-description-disabled"]').should('have.text', 'Updated Description');
    cy.get('[data-cy="scenario-description-disabled"]').should('not.have.text', 'Description before edition');

    // Update the tags
    cy.get('[data-testid="CancelIcon"]').click();
    cy.wait(500);
    cy.get('[data-cy="add-tag"]').click();
    cy.wait(500);
    cy.get('[id="new-tag-input"]')
      .click()
      .type('EditedTag' + '{enter}');
    // Check old tag is no longer displayed and the one one is displayed
    cy.get('[data-cy="scenario-tags-tags"]').should('contain', 'EditedTag');
    cy.get('[data-cy="scenario-tags-tags"]').should('not.contain', 'FirstTag');
  });
});
