import 'cypress-file-upload';
const connection = require('../../functions/connect.cy.js');
const datasetManager = require('../../functions/datasetManager.cy.js');
const config = require('../../../variables.cy.js');
const scenario = require('../../functions/scenario.cy.js');

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

  it('PROD-11817: Delete a scenario', () => {
    //Create a dataset that will be needed during all test that create scenarios with no specific dataset required. This dataset will be removed at the end of the tests in the After.cy.js tests.
    connection.connect();
    // Remove the created scenario in case it's a second try
    scenario.deleteScenario('DLOP-PROD-1187-DeleteScenario');
    // Create and run the scenario that will be used for the deletion tests
    scenario.createScenario('DLOP-PROD-1187-DeleteScenario', 'master', 'DLOP-Reference-for-automated-tests', 'BreweryParameters');
    scenario.runScenario('DLOP-PROD-1187-DeleteScenario');

    // Delete the scenario
    connection.navigate('manager');
    scenario.searchScenarioInManager('DLOP-PROD-1187-DeleteScenario');
    cy.get('[data-cy="scenario-delete-button"]').click();
    // Check the warning popup displays a text to warn the user
    cy.get('[id="confirm-scenario-delete-description"]', { timeout: 60000 }).should('have.text', 'This operation is irreversible. Dataset(s) will not be removed, but the scenario parameters will be lost. If this scenario has children, they will be moved to a new parent. The new parent will be the parent of the deleted scenario.');
    cy.get('[aria-labelledby="confirm-scenario-delete"]').should('contain', 'Cancel');
    cy.get('[aria-labelledby="confirm-scenario-delete"]').should('contain', 'Confirm');
    // Confirm the deletion
    cy.contains('Confirm').click();
    cy.wait(2000);

    // Create a scenario once again, with the same name as the deleted one
    scenario.createScenario('DLOP-PROD-1187-DeleteScenario', 'master', 'DLOP-Reference-for-automated-tests', 'BreweryParameters');

    // Delete then cancel deletion
    connection.navigate('manager');
    scenario.searchScenarioInManager('DLOP-PROD-1187-DeleteScenario');
    cy.get('[data-cy="scenario-delete-button"]').click();
    cy.contains('Cancel', { timeout: 60000 }).click();
    cy.wait(200);
    // Check scenario has not been deleted
    scenario.searchScenarioInManager('DLOP-PROD-1187-DeleteScenario');

    // Clean the scenario used for the test
    scenario.deleteScenario('DLOP-PROD-1187-DeleteScenario');
  });

  it('PROD-13879: Search scenarios', () => {
    connection.connect();
    // Remove scenarios in case it's a second try
    scenario.deleteScenario('SearchScenario-PROD-13879-SearchScenario');
    scenario.deleteScenario('PROD-13879-SearchScenario');
    scenario.deleteScenario('SearchScenario-PROD-13879');
    scenario.deleteScenario('PROD-1373X');
    scenario.deleteScenario('SearchScenario-NotResearched');
    scenario.deleteScenario('PROD-13879-FirstSearchTestDescriptionOrTag');
    scenario.deleteScenario('PROD-13879-SecondSearchTestDescriptionOrTag');

    // Create the scenarios that will be used for the edition tests
    scenario.createScenario('PROD-13879-SearchScenario', 'master', 'DLOP-Reference-for-automated-tests', 'BreweryParameters');
    scenario.createScenario('SearchScenario-NotResearched', 'master', 'DLOP-Reference-for-automated-tests', 'BreweryParameters');
    scenario.createScenario('SearchScenario-PROD-13879', 'master', 'DLOP-Reference-for-automated-tests', 'BreweryParameters');
    scenario.createScenario('SearchScenario-PROD-13879-SearchScenario', 'master', 'DLOP-Reference-for-automated-tests', 'BreweryParameters');
    scenario.createScenario('PROD-1373X', 'master', 'DLOP-Reference-for-automated-tests', 'BreweryParameters');

    // Check there is a research text field in the scenario manager view and search for PROD-13879. It should return only 3 scenarios.
    connection.navigate('manager');
    cy.get('[id="scenario-manager-search-field"]').should('exist');
    cy.get('#scenario-manager-search-field').click().clear().type('PROD-13879');
    cy.wait(500);
    // Check the correct scenarios are diplayed
    cy.get('[aria-label="PROD-13879-SearchScenario"]').should('exist');
    cy.get('[aria-label="SearchScenario-PROD-13879-SearchScenario"]').should('exist');
    cy.get('[aria-label="SearchScenario-PROD-13879"]').should('exist');
    // Check the scenarios that don't match the research are not displayed
    cy.get('[aria-label="PROD-1373X"]').should('not.exist');
    cy.get('[aria-label="SearchScenario-NotResearched"]').should('not.exist');

    // Clear the search field, all scenario are listed again
    cy.get('#scenario-manager-search-field').click().clear();
    cy.get('[aria-label="PROD-13879-SearchScenario"]').should('exist');
    cy.get('[aria-label="SearchScenario-PROD-13879-SearchScenario"]').should('exist');
    cy.get('[aria-label="SearchScenario-PROD-13879"]').should('exist');
    cy.get('[aria-label="PROD-1373X"]').should('exist');
    cy.get('[aria-label="SearchScenario-NotResearched"]').should('exist');

    // Search string that is sure to don't match any scenario and check the page is empty
    cy.get('#scenario-manager-search-field').click().clear().type('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    cy.get('[data-cy^="scenario-accordion"]').should('not.exist');

    // Create two scenarios with description and tag to check the research usint these fields.
    // As for the edition test, function create can't be used, so scenarios will be manually created
    connection.navigate('scenario-view');
    cy.get('[data-cy="create-scenario-button"]').click({ force: true });
    cy.get('#scenarioName').click().type('PROD-13879-FirstSearchTestDescriptionOrTag');
    cy.get('[data-cy="create-scenario-dialog-master-checkbox"]').click({ force: true });
    cy.get('[placeholder="Select a dataset"]').click().clear().type('DLOP-Reference-for-automated-tests').type('{downarrow}{enter}');
    cy.get('[id="scenarioType"]').click({ force: true });
    cy.get('[id="scenarioType"]').click().clear().type('Run template with Brewery parameters').type('{downarrow}{enter}');
    cy.get('[data-cy="text-input-new-scenario-description"]').click({ force: true }).clear().type('Description here will contain the sentence "QA team is the best"');
    cy.get('[id="new-scenario-tags"]')
      .click({ force: true })
      .clear()
      .type('FirstTag' + '{enter}');
    // Validate the scenario creation
    cy.get('[data-cy="create-scenario-dialog-submit-button"]').click({ force: true });
    cy.wait(1000);

    cy.get('[data-cy="create-scenario-button"]').click({ force: true });
    cy.get('#scenarioName').click().type('PROD-13879-SecondSearchTestDescriptionOrTag');
    cy.get('[data-cy="create-scenario-dialog-master-checkbox"]').click({ force: true });
    cy.get('[placeholder="Select a dataset"]').click().clear().type('DLOP-Reference-for-automated-tests').type('{downarrow}{enter}');
    cy.get('[id="scenarioType"]').click({ force: true });
    cy.get('[id="scenarioType"]').click().clear().type('Run template with Brewery parameters').type('{downarrow}{enter}');
    cy.get('[data-cy="text-input-new-scenario-description"]').click({ force: true }).clear().type('Description here will contain the sentence "Testing is the best thing in the world"');
    cy.get('[id="new-scenario-tags"]')
      .click({ force: true })
      .clear()
      .type('SecondTag' + '{enter}');
    // Validate the scenario creation
    cy.get('[data-cy="create-scenario-dialog-submit-button"]').click({ force: true });
    cy.wait(1000);

    // Search for "QA team is the best", should return only the first scenario
    connection.navigate('manager');
    cy.get('#scenario-manager-search-field').click().clear().type('QA team is the best');
    cy.get('[aria-label="PROD-13879-FirstSearchTestDescriptionOrTag"]').should('exist');
    cy.get('[aria-label="PROD-13879-SecondSearchTestDescriptionOrTag"]').should('not.exist');

    // Search for "SecondTag", should return only the second scenario
    cy.get('#scenario-manager-search-field').click().clear().type('SecondTag');
    cy.get('[aria-label="PROD-13879-SecondSearchTestDescriptionOrTag"]').should('exist');
    cy.get('[aria-label="PROD-13879-FirstSearchTestDescriptionOrTag"]').should('not.exist');

    // Clean the scenario used during the test
    cy.wait(500);
    scenario.deleteScenario('SearchScenario-PROD-13879-SearchScenario');
    scenario.deleteScenario('PROD-13879-SearchScenario');
    scenario.deleteScenario('SearchScenario-PROD-13879');
    scenario.deleteScenario('PROD-1373X');
    scenario.deleteScenario('SearchScenario-NotResearched');
    scenario.deleteScenario('PROD-13879-SecondSearchTestDescriptionOrTag');
    scenario.deleteScenario('PROD-13879-FirstSearchTestDescriptionOrTag');
  });
});
