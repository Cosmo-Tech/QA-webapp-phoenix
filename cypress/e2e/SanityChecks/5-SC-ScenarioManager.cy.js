import 'cypress-file-upload';
var connection = require('../../functions/connect.cy.js');
var datasetManager = require('../../functions/datasetManager.cy.js');
var config = require('../../../variables.cy.js');
var scenario = require('../../functions/scenario.cy.js');

describe('Scenario Manager feature', () => {
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

  it('PROD-13737: Search scenarios', () => {
    connection.connect();
    // Remove scenarios in case it's a second try
    scenario.deleteScenario('SearchScenario-PROD-13737-SearchScenario');
    scenario.deleteScenario('PROD-13737-SearchScenario');
    scenario.deleteScenario('SearchScenario-PROD-13737');
    scenario.deleteScenario('PROD-1373X');
    scenario.deleteScenario('SearchScenario-NotResearched');
    // Create the scenarios that will be used for the edition tests
    scenario.createScenario('PROD-13737-SearchScenario', 'master', 'Reference-for-all-scenario-creation-tests', 'BreweryParameters');
    scenario.createScenario('SearchScenario-NotResearched', 'master', 'Reference-for-all-scenario-creation-tests', 'BreweryParameters');
    scenario.createScenario('SearchScenario-PROD-13737', 'master', 'Reference-for-all-scenario-creation-tests', 'BreweryParameters');
    scenario.createScenario('SearchScenario-PROD-13737-SearchScenario', 'master', 'Reference-for-all-scenario-creation-tests', 'BreweryParameters');
    scenario.createScenario('PROD-1373X', 'master', 'Reference-for-all-scenario-creation-tests', 'BreweryParameters');

    // Check there is a research text field in the scenario manager view and search for PROD-13737. It should return only 3 scenarios.
    connection.navigate('manager');
    cy.get('[id="scenario-manager-search-field"]').should('exist');
    cy.get('#scenario-manager-search-field').click().clear().type('PROD-13737');
    cy.wait(500);
    // Check the correct scenarios are diplayed
    cy.get('[aria-label="PROD-13737-SearchScenario"]').should('exist');
    cy.get('[aria-label="SearchScenario-PROD-13737-SearchScenario"]').should('exist');
    cy.get('[aria-label="SearchScenario-PROD-13737"]').should('exist');
    // CHeck the scenarios that don't match the research are not displayed
    cy.get('[aria-label="PROD-1373X"]').should('not.exist');
    cy.get('[aria-label="SearchScenario-NotResearched"]').should('not.exist');

    // Clear the search field, all scenario are listed again
    cy.get('#scenario-manager-search-field').click().clear();
    cy.get('[aria-label="PROD-13737-SearchScenario"]').should('exist');
    cy.get('[aria-label="SearchScenario-PROD-13737-SearchScenario"]').should('exist');
    cy.get('[aria-label="SearchScenario-PROD-13737"]').should('exist');
    cy.get('[aria-label="PROD-1373X"]').should('exist');
    cy.get('[aria-label="SearchScenario-NotResearched"]').should('exist');

    // Search string that is sure to don't match any scenario and check the page is empty
    cy.get('#scenario-manager-search-field').click().clear().type('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    cy.get('[data-cy^="scenario-accordion"]').should('not.exist');

    // Clean the scenario used during the test
    scenario.deleteScenario('SearchScenario-PROD-13737-SearchScenario');
    scenario.deleteScenario('PROD-13737-SearchScenario');
    scenario.deleteScenario('SearchScenario-PROD-13737');
    scenario.deleteScenario('PROD-1373X');
    scenario.deleteScenario('SearchScenario-NotResearched');
  });
});
