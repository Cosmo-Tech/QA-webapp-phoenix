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
    connection.connect();
    // Remove scenarios in case it's a second try
    scenario.deleteScenario('Updated-PROD-11816');
    scenario.deleteScenario('PROD-11816-EditName');
    // Create the scenario that will be used for the edition tests
    scenario.createScenario('PROD-11816-EditName', 'master', 'Reference-for-all-scenario-creation-tests', 'BreweryParameters');
    // Edit the name of the scenario
    connection.navigate('manager');
    scenario.searchScenarioInManager('PROD-11816-EditName');
    cy.get('[data-testid="EditIcon"]').click();
    cy.wait(1000);
    cy.get('[placeholder="Scenario name"]')
      .click()
      .clear()
      .type('Updated-PROD-11816' + '{enter}');

    // Check the new name is persistant
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

  it('PROD-11817: Delete a scenario', () => {
    //Create a dataset that will be needed during all test that create scenarios with no specific dataset required. This dataset will be removed at the end of the tests in the After.cy.js tests.
    connection.connect();
    // Remove the created scenario in case it's a second try
    scenario.deleteScenario('PROD-1187-DeleteScenario');
    //scenario.deleteScenario('PROD-11816-EditName');
    // Create and run the scenario that will be used for the deletion tests
    scenario.createScenario('PROD-1187-DeleteScenario', 'master', 'Reference-for-all-scenario-creation-tests', 'BreweryParameters');
    scenario.runScenario('PROD-1187-DeleteScenario');

    // Delete the scenario
    connection.navigate('manager');
    scenario.searchScenarioInManager('PROD-1187-DeleteScenario');
    cy.get('[data-cy="scenario-delete-button"]').click();
    // Check the warning popup displays a text to warn the user
    cy.get('[id="confirm-scenario-delete-description"]', { timeout: 60000 }).should('have.text', 'This operation is irreversible. Dataset(s) will not be removed, but the scenario parameters will be lost. If this scenario has children, they will be moved to a new parent. The new parent will be the parent of the deleted scenario.');
    cy.get('[aria-labelledby="confirm-scenario-delete"]').should('contain', 'Cancel');
    cy.get('[aria-labelledby="confirm-scenario-delete"]').should('contain', 'Confirm');
    // Confirm the deletion
    cy.contains('Confirm').click();
    cy.wait(2000);

    // Create a scenario once again, with the same name as the deleted one
    scenario.createScenario('PROD-1187-DeleteScenario', 'master', 'Reference-for-all-scenario-creation-tests', 'BreweryParameters');

    // Delete then cancel deletion
    connection.navigate('manager');
    scenario.searchScenarioInManager('PROD-1187-DeleteScenario');
    cy.get('[data-cy="scenario-delete-button"]').click();
    cy.contains('Cancel', { timeout: 60000 }).click();
    cy.wait(200);
    // Check scenario has not been deleted
    scenario.searchScenarioInManager('PROD-1187-DeleteScenario');

    // Clean the scenario used for the test
    scenario.deleteScenario('PROD-1187-DeleteScenario');
  });
});
