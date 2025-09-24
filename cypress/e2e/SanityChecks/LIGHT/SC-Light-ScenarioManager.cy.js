import 'cypress-file-upload';
const connection = require('../../../functions/connect.cy.js');
const datasetManager = require('../../../functions/datasetManager.cy.js');
const config = require('../../../../variables.cy.js');
const scenario = require('../../../functions/scenario.cy.js');

let testData;

describe('Scenario Manager feature', () => {
  before(() => {
    cy.fixture('lightTestData').then((data) => {
      testData = data;
    });
  });
  it('PROD-11817: Delete a scenario', () => {
    //Create a dataset that will be needed during all test that create scenarios with no specific dataset required. This dataset will be removed at the end of the tests in the After.cy.js tests.
    connection.connect();
    // Remove the created scenario in case it's a second try
    scenario.deleteScenario(testData.scenarios.testScenarios.deleteScenario);
    // Create and run the scenario that will be used for the deletion tests
    scenario.createScenario(testData.scenarios.testScenarios.deleteScenario, testData.scenarios.common.branch, testData.datasets.reference.name, testData.scenarios.common.breweryParameters);
    scenario.runScenario(testData.scenarios.testScenarios.deleteScenario);

    // Delete the scenario
    connection.navigate('manager');
    scenario.searchScenarioInManager(testData.scenarios.testScenarios.deleteScenario);
    cy.get(`[data-cy="${testData.ui.buttons.scenarioDelete}"]`).click();
    // Check the warning popup displays a text to warn the user
    cy.get(`[id="${testData.ui.dialogs.confirmDelete.description}"]`, { timeout: 60000 }).should('contain', testData.ui.dialogs.confirmDelete.irreversibleText);
    cy.get(`[aria-labelledby="${testData.ui.dialogs.confirmDelete.description.replace('-description', '')}"]`).should('contain', testData.ui.dialogs.confirmDelete.cancelButton);
    cy.get(`[aria-labelledby="${testData.ui.dialogs.confirmDelete.description.replace('-description', '')}"]`).should('contain', testData.ui.dialogs.confirmDelete.confirmButton);
    // Confirm the deletion
    cy.contains(testData.ui.dialogs.confirmDelete.confirmButton).click();
    cy.get(`[aria-label="${testData.scenarios.testScenarios.deleteScenario}"]`).should('not.exist');

    // Create a scenario once again, with the same name as the deleted one
    scenario.createScenario(testData.scenarios.testScenarios.deleteScenario, testData.scenarios.common.branch, testData.datasets.reference.name, testData.scenarios.common.breweryParameters);

    // Delete then cancel deletion
    connection.navigate('manager');
    scenario.searchScenarioInManager(testData.scenarios.testScenarios.deleteScenario);
    cy.get(`[data-cy="${testData.ui.buttons.scenarioDelete}"]`).click();
    cy.contains(testData.ui.dialogs.confirmDelete.cancelButton, { timeout: 60000 }).click();
    // Wait for the delete dialog to disappear, confirming cancellation
    cy.get(`[aria-labelledby="${testData.ui.dialogs.confirmDelete.description.replace('-description', '')}"]`).should('not.exist');
    // Check scenario has not been deleted
    scenario.searchScenarioInManager(testData.scenarios.testScenarios.deleteScenario);

    // Clean the scenario used for the test
    scenario.deleteScenario(testData.scenarios.testScenarios.deleteScenario);
  });

  it('PROD-13879: Search scenarios', () => {
    connection.connect();
    // Remove scenarios in case it's a second try
    scenario.deleteScenario(testData.scenarios.testScenarios.searchScenarios.longSearchScenario);
    scenario.deleteScenario(testData.scenarios.testScenarios.searchScenarios.main);
    scenario.deleteScenario(testData.scenarios.testScenarios.searchScenarios.searchScenarioProd);
    scenario.deleteScenario(testData.scenarios.testScenarios.searchScenarios.prodVariant);
    scenario.deleteScenario(testData.scenarios.testScenarios.searchScenarios.notResearched);
    scenario.deleteScenario(testData.scenarios.testScenarios.searchScenarios.firstDescriptionTag);
    scenario.deleteScenario(testData.scenarios.testScenarios.searchScenarios.secondDescriptionTag);

    // Create the scenarios that will be used for the edition tests
    scenario.createScenario(testData.scenarios.testScenarios.searchScenarios.main, testData.scenarios.common.branch, testData.datasets.reference.name, testData.scenarios.common.breweryParameters);
    scenario.createScenario(testData.scenarios.testScenarios.searchScenarios.notResearched, testData.scenarios.common.branch, testData.datasets.reference.name, testData.scenarios.common.breweryParameters);
    scenario.createScenario(testData.scenarios.testScenarios.searchScenarios.searchScenarioProd, testData.scenarios.common.branch, testData.datasets.reference.name, testData.scenarios.common.breweryParameters);
    scenario.createScenario(testData.scenarios.testScenarios.searchScenarios.longSearchScenario, testData.scenarios.common.branch, testData.datasets.reference.name, testData.scenarios.common.breweryParameters);
    scenario.createScenario(testData.scenarios.testScenarios.searchScenarios.prodVariant, testData.scenarios.common.branch, testData.datasets.reference.name, testData.scenarios.common.breweryParameters);

    // Check there is a research text field in the scenario manager view and search for PROD-13879. It should return only 3 scenarios.
    connection.navigate('manager');
    cy.get('[id="scenario-manager-search-field"]').should('exist');
    // Wait for the expected search results to appear
    cy.get('[aria-label="PROD-13879-SearchScenario"]', { timeout: 10000 }).should('exist');
    cy.get('[aria-label="SearchScenario-PROD-13879-SearchScenario"]').should('exist');
    cy.get('[aria-label="SearchScenario-PROD-13879"]').should('exist');
    cy.get('[aria-label="SearchScenario-PROD-13879"]').should('exist');
    // Check the scenarios that don't match the research are not displayed
    cy.get('[aria-label="PROD-1373X"]').should('not.exist');
    cy.get('[aria-label="SearchScenario-NotResearched"]').should('not.exist');

    // Clear the search field, all scenario are listed again
    cy.get(testData.ui.search.fieldId).click().clear();
    cy.get(`[aria-label="${testData.scenarios.testScenarios.searchScenarios.main}"]`).should('exist');
    cy.get(`[aria-label="${testData.scenarios.testScenarios.searchScenarios.longSearchScenario}"]`).should('exist');
    cy.get(`[aria-label="${testData.scenarios.testScenarios.searchScenarios.searchScenarioProd}"]`).should('exist');
    cy.get(`[aria-label="${testData.scenarios.testScenarios.searchScenarios.prodVariant}"]`).should('exist');
    cy.get(`[aria-label="${testData.scenarios.testScenarios.searchScenarios.notResearched}"]`).should('exist');

    // Search string that is sure to don't match any scenario and check the page is empty
    cy.get(testData.ui.search.fieldId).click().clear().type(testData.searchTerms.noMatch);
    cy.get('[data-cy^="scenario-accordion"]').should('not.exist');

    // Create two scenarios with description and tag to check the research usint these fields.
    // As for the edition test, function create can't be used, so scenarios will be manually created
    connection.navigate('scenario-view');
    cy.get('[data-cy="create-scenario-button"]').click({ force: true });
    cy.get('#scenarioName').click().type(testData.scenarios.testScenarios.searchScenarios.firstDescriptionTag);
    cy.get('[data-cy="create-scenario-dialog-master-checkbox"]').click({ force: true });
    cy.get('[placeholder="Select a dataset"]').click().clear().type(testData.datasets.reference.name).type('{downarrow}{enter}');
    cy.get('[id="scenarioType"]').click({ force: true });
    cy.get('[id="scenarioType"]').click().clear().type(testData.ui.metadata.runTemplate).type('{downarrow}{enter}');
    cy.get('[data-cy="text-input-new-scenario-description"]').click({ force: true }).clear().type(testData.descriptions.qaTeamBest);
    cy.get('[id="new-scenario-tags"]')
      .click({ force: true })
      .clear()
      .type(testData.tags.firstTag + '{enter}');
    // Validate the scenario creation
    cy.get('[data-cy="create-scenario-dialog-submit-button"]').click({ force: true });
    cy.get(`[aria-label="${testData.scenarios.testScenarios.searchScenarios.firstDescriptionTag}"]`, { timeout: 10000 }).should('exist');
    cy.get('[data-cy="create-scenario-button"]').click({ force: true });
    cy.get('#scenarioName').click().type(testData.scenarios.testScenarios.searchScenarios.secondDescriptionTag);
    cy.get('[data-cy="create-scenario-dialog-master-checkbox"]').click({ force: true });
    cy.get('[placeholder="Select a dataset"]').click().clear().type(testData.datasets.reference.name).type('{downarrow}{enter}');
    cy.get('[id="scenarioType"]').click({ force: true });
    cy.get('[id="scenarioType"]').click().clear().type(testData.ui.metadata.runTemplate).type('{downarrow}{enter}');
    cy.get('[data-cy="text-input-new-scenario-description"]').click({ force: true }).clear().type(testData.descriptions.testingBest);
    cy.get('[id="new-scenario-tags"]')
      .click({ force: true })
      .clear()
      .type(testData.tags.secondTag + '{enter}');
    // Validate the scenario creation
    cy.get('[data-cy="create-scenario-dialog-submit-button"]').click({ force: true });
    cy.wait(1000);

    // Search for "QA team is the best", should return only the first scenario
    connection.navigate('manager');
    cy.get(testData.ui.search.fieldId).click().clear().type(testData.searchTerms.qaTeamBest);
    cy.get(`[aria-label="${testData.scenarios.testScenarios.searchScenarios.firstDescriptionTag}"]`).should('exist');
    cy.get(`[aria-label="${testData.scenarios.testScenarios.searchScenarios.secondDescriptionTag}"]`).should('not.exist');

    // Search for "SecondTag", should return only the second scenario
    cy.get(testData.ui.search.fieldId).click().clear().type(testData.searchTerms.secondTag);
    cy.get(`[aria-label="${testData.scenarios.testScenarios.searchScenarios.secondDescriptionTag}"]`).should('exist');
    cy.get(`[aria-label="${testData.scenarios.testScenarios.searchScenarios.firstDescriptionTag}"]`).should('not.exist');

    // Clean the scenario used during the test
    cy.get(testData.ui.search.fieldId, { timeout: 10000 }).should('exist');
    scenario.deleteScenario(testData.scenarios.testScenarios.searchScenarios.longSearchScenario);
    scenario.deleteScenario(testData.scenarios.testScenarios.searchScenarios.main);
    scenario.deleteScenario(testData.scenarios.testScenarios.searchScenarios.searchScenarioProd);
    scenario.deleteScenario(testData.scenarios.testScenarios.searchScenarios.prodVariant);
    scenario.deleteScenario(testData.scenarios.testScenarios.searchScenarios.notResearched);
    scenario.deleteScenario(testData.scenarios.testScenarios.searchScenarios.secondDescriptionTag);
    scenario.deleteScenario(testData.scenarios.testScenarios.searchScenarios.firstDescriptionTag);
  });
});
