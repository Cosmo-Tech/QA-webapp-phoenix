var connection = require('../../functions/connect.cy.js');
var datasetManager = require('../../functions/datasetManager.cy.js');
var config = require('../../../variables.cy.js');
var scenario = require('../../functions/scenario.cy.js');
const { exists } = require('i18next');
const { SendAndArchive } = require('@mui/icons-material');

describe('Scenario Manager feature', () => {
  // May not be needed if other test has been run yet, but dataset created in case it's needed
  /*it('Create a dataset for scenario creations', () => {
    //Create a dataset that will be needed during all test that create scenarios with no specific dataset required. This dataset will be removed at the end of the tests in the After.cy.js tests.
    connection.connect();
    connection.navigate('dataset');
    var datasetName = 'Reference-for-all-scenario-creation-tests';
    datasetManager.createDatasetLocalFile(datasetName, 'A basic reference dataset for brewery model', 'reference_dataset');
  });*/

  it('PROD-11816: Edit the name of a scenario', () => {
    //Create a dataset that will be needed during all test that create scenarios with no specific dataset required. This dataset will be removed at the end of the tests in the After.cy.js tests.
    connection.connect();
    scenario.deleteScenario('Updated-PROD-11816');
    scenario.deleteScenario('PROD-11816-EditName');
    scenario.createScenario('PROD-11816-EditName', 'master', 'Reference-for-all-scenario-creation-tests', 'BreweryParameters');
    connection.navigate('manager');
    scenario.searchScenarioInManager('PROD-11816-EditName');
    cy.get('[data-testid="EditIcon"]').click();
    cy.wait(1000);
    cy.get('[placeholder="Scenario name"]')
      .click()
      .clear()
      .type('Updated-PROD-11816' + '{enter}');

    scenario.searchScenarioInManager('Updated-PROD-11816');

    // Try forbiden character and check the error message display
    cy.get('[data-testid="EditIcon"]').click();
    cy.wait(1000);
    cy.get('[placeholder="Scenario name"]').click().clear().type('?');
    cy.get('[data-cy^="scenario-accordion-"]').should('contain', 'Scenario name has to start with a letter or a digit, and can only contain letters, digits, spaces, underscores, hyphens and dots.');
    cy.get('[placeholder="Scenario name"]').click().clear().type('$');
    cy.get('[data-cy^="scenario-accordion-"]').should('contain', 'Scenario name has to start with a letter or a digit, and can only contain letters, digits, spaces, underscores, hyphens and dots.');
    cy.get('[placeholder="Scenario name"]').click().clear().type('%');
    cy.get('[data-cy^="scenario-accordion-"]').should('contain', 'Scenario name has to start with a letter or a digit, and can only contain letters, digits, spaces, underscores, hyphens and dots.');
    cy.get('[placeholder="Scenario name"]').click().clear().type('é');
    cy.get('[data-cy^="scenario-accordion-"]').should('contain', 'Scenario name has to start with a letter or a digit, and can only contain letters, digits, spaces, underscores, hyphens and dots.');
    cy.get('[placeholder="Scenario name"]').click().clear().type('#');
    cy.get('[data-cy^="scenario-accordion-"]').should('contain', 'Scenario name has to start with a letter or a digit, and can only contain letters, digits, spaces, underscores, hyphens and dots.');
    cy.get('[placeholder="Scenario name"]').click().clear().type('€');
    cy.get('[data-cy^="scenario-accordion-"]').should('contain', 'Scenario name has to start with a letter or a digit, and can only contain letters, digits, spaces, underscores, hyphens and dots.');
    cy.get('[placeholder="Scenario name"]').click().clear().type('@');
    cy.get('[data-cy^="scenario-accordion-"]').should('contain', 'Scenario name has to start with a letter or a digit, and can only contain letters, digits, spaces, underscores, hyphens and dots.');
    cy.get('[placeholder="Scenario name"]').click().clear().type('(');
    cy.get('[data-cy^="scenario-accordion-"]').should('contain', 'Scenario name has to start with a letter or a digit, and can only contain letters, digits, spaces, underscores, hyphens and dots.');
    cy.get('[placeholder="Scenario name"]').click().clear().type('&');
    cy.get('[data-cy^="scenario-accordion-"]').should('contain', 'Scenario name has to start with a letter or a digit, and can only contain letters, digits, spaces, underscores, hyphens and dots.');
    cy.get('[placeholder="Scenario name"]').click().clear().type('+');
    cy.get('[data-cy^="scenario-accordion-"]').should('contain', 'Scenario name has to start with a letter or a digit, and can only contain letters, digits, spaces, underscores, hyphens and dots.');
    cy.get('[placeholder="Scenario name"]').click().clear().type('ç');
    cy.get('[data-cy^="scenario-accordion-"]').should('contain', 'Scenario name has to start with a letter or a digit, and can only contain letters, digits, spaces, underscores, hyphens and dots.');
    cy.get('[placeholder="Scenario name"]').click().clear().type('"');
    cy.get('[data-cy^="scenario-accordion-"]').should('contain', 'Scenario name has to start with a letter or a digit, and can only contain letters, digits, spaces, underscores, hyphens and dots.');
    cy.get('[placeholder="Scenario name"]').click().clear().type('{enter}');

    // Check the name has not been updated after validation
    scenario.searchScenarioInManager('Updated-PROD-11816');

    // Try to empty the scenario name
    cy.get('[data-testid="EditIcon"]').click();
    cy.wait(1000);
    cy.get('[placeholder="Scenario name"]').click().clear();
    cy.get('[data-cy^="scenario-accordion-"]').should('contain', 'Scenario name cannot be empty');
    cy.get('[placeholder="Scenario name"]').click().clear().type('{enter}');

    // Check the name has not been updated after validation
    scenario.searchScenarioInManager('Updated-PROD-11816');

    // Create a new scenario, then try to rename one like the other (unique name, so can't do that)
    // Same name as the previous one is used to check the original name is available after edition.
    scenario.createScenario('PROD-11816-EditName', 'master', 'Reference-for-all-scenario-creation-tests', 'BreweryParameters');
    connection.navigate('manager');
    scenario.searchScenarioInManager('Updated-PROD-11816');
    cy.get('[data-testid="EditIcon"]').click();
    cy.wait(1000);
    cy.get('[placeholder="Scenario name"]').click().clear().type('PROD-11816-EditName');
    cy.get('[data-cy^="scenario-accordion-"]').should('contain', 'Scenario name already exists');

    // Check the name has not been updated after validation
    scenario.searchScenarioInManager('Updated-PROD-11816');

    // Remove the two scenario used
    scenario.deleteScenario('Updated-PROD-11816');
    scenario.deleteScenario('PROD-11816-EditName');
  });
});
