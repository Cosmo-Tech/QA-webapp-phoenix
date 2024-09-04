import 'cypress-file-upload';
var connection = require('../../functions/connect.cy.js');
var datasetManager = require('../../functions/datasetManager.cy.js');
var config = require('../../../variables.cy.js');
var scenario = require('../../functions/scenario.cy.js');

describe('Global IHM and menu checks', () => {
  it('PROD-11913 -> Scenario view & Scenario Manager - IHM - Dashboards check if no scenario', () => {
    connection.connect();
    connection.navigate('dashboards');
    cy.contains('Stocks Follow-up').click();
    cy.get('body').should('contain', 'No scenario. You can create a new scenario in the Scenario view.');
  });

  it('PROD-11913 -> Scenario view & Scenario Manager - IHM - Digital Twin check if no scenario', () => {
    connection.connect();
    connection.navigate('digital-twin');
    cy.get('body').should('contain', 'No scenario. You can create a new scenario in the Scenario view.');
  });

  it('PROD-11913 -> Scenario view & Scenario Manager - IHM Scenario View if no scenario', () => {
    connection.connect();
    connection.navigate('scenario-view');
    // Only "Create" button and "Dashboard" section
    cy.get('[data-cy="create-scenario-button"]').should('exist');
    cy.get('[data-cy="dashboards-accordion"]').click();
    cy.get('body').should('contain', 'No scenario yet');
    cy.get('[data-cy="dashboard-placeholder"]').should('contain', 'You can create a scenario by clicking on the "CREATE" button');
    cy.get('[data-cy="share-scenario-button"]').should('not.exist');
    cy.get('[data-cy="validate-scenario-button"]').should('not.exist');
    cy.get('[data-cy="reject-scenario-button"]').should('not.exist');
    cy.get('[data-cy="launch-scenario-button"]').should('not.exist');
    cy.get('[data-cy="scenario-params-accordion"]').should('not.exist');
  });

  it('PROD-11913 -> Scenario view & Scenario Manager - IHM Scenario View and Scenario Manager', () => {
    connection.connect();
    scenario.deleteScenario('PROD-11913-ThisIsAVeryLongScenarioNameSoThreeDotsWillDisplaysInsteadOfCompleteNameToCheckSpecs');
    scenario.createScenario('PROD-11913-ThisIsAVeryLongScenarioNameSoThreeDotsWillDisplaysInsteadOfCompleteNameToCheckSpecs', 'master', 'Reference-for-all-scenario-creation-tests', 'BreweryParameters');

    // New buttons are available and the no scenario yet message is not anymore diplayed
    cy.get('[data-cy="create-scenario-button"]').should('exist');
    cy.get('[data-cy="dashboards-accordion"]').should('exist');
    cy.get('[data-cy="share-scenario-button"]').should('exist');
    cy.get('[data-cy="validate-scenario-button"]').should('exist');
    cy.get('[data-cy="reject-scenario-button"]').should('exist');
    cy.get('[data-cy="launch-scenario-button"]').should('exist');
    cy.get('[data-cy="scenario-params-accordion"]').should('exist');
    cy.get('[data-cy="dashboard-placeholder"]').should('not.contain', 'No scenario yet');
    cy.get('[data-cy="dashboard-placeholder"]').should('not.contain', 'You can create a scenario by clicking on the "CREATE" button');

    // Run the scenario and check if the logs button display.
    //No check on the dashboards, as the webapp may not be connected to PowerBI.
    //A separated test will be run for that, so if the webapp is not connected, failure of these tests won't impact the whole test.
    scenario.runScenario('PROD-11913-ThisIsAVeryLongScenarioNameSoThreeDotsWillDisplaysInsteadOfCompleteNameToCheckSpecs');
    connection.navigate('scenario-view');
    cy.get('[data-cy="successful-run-logs-download-button"]').should('exist');

    // Create scenario for validation/reject checks
    scenario.deleteScenario('A-ValidatedScenario');
    scenario.deleteScenario('B-RejectedScenario');
    scenario.createScenario('A-ValidatedScenario', 'master', 'Reference-for-all-scenario-creation-tests', 'BreweryParameters');
    scenario.validateScenario('A-ValidatedScenario');
    scenario.createScenario('B-RejectedScenario', 'master', 'Reference-for-all-scenario-creation-tests', 'BreweryParameters');
    scenario.rejectScenario('B-RejectedScenario');

    // Check the scenario manager IHM
    connection.navigate('manager');
    cy.get('[data-cy="scenario-manager-search-field"]').should('exist');
    cy.get('[data-testid="UnfoldLessIcon"]').should('exist');
    cy.get('[data-testid="UnfoldMoreIcon"]').should('exist');
    cy.get('[data-testid="AccountTreeIcon"]').should('exist');
    cy.get('[data-testid="EditIcon"]').should('exist');
    cy.get('[data-testid="DeleteForeverIcon"]').should('exist');
    cy.get('[data-testid="ExpandMoreIcon"]').should('exist');

    // Check cards are folded
    cy.get('[data-cy^="scenario-accordion-"]').find('[aria-expanded=false]').should('exist');
    cy.get('[data-cy="scenario-owner-name"]').should('not.exist');

    // Check on folded card for the validated scenario
    scenario.searchScenarioInManager('A-ValidatedScenario');
    cy.get('[data-cy="scenario-view-redirect"]').should('contain', 'A-ValidatedScenario');
    cy.get('[data-cy^="scenario-accordion-"]').should('contain', 'Run template with Brewery parameters');
    // Check on unfolded card for the validated scenario
    cy.get('[data-testid="ExpandMoreIcon"]').click();
    cy.get('[data-cy="scenario-owner-name"]').should('exist');
    cy.get('[data-cy="scenario-creation-date"]').should('exist');
    cy.get('[data-cy="scenario-view-redirect"]').should('contain', 'A-ValidatedScenario');
    cy.get('[data-cy="scenario-status-created"]').should('contain', 'Created');
    cy.get('[data-cy="scenario-run-template"]').should('contain', 'Run template with Brewery parameters');
    cy.get('[data-cy="scenario-datasets"]').should('contain', 'Reference-for-all-scenario-creation-tests');
    cy.get('[data-cy="scenario-validation-status"]').should('contain', 'Validated');

    // Check on folded card for the rejected scenario
    scenario.searchScenarioInManager('B-RejectedScenario');
    cy.get('[data-cy="scenario-view-redirect"]').should('contain', 'B-RejectedScenario');
    cy.get('[data-cy^="scenario-accordion-"]').should('contain', 'Run template with Brewery parameters');
    // Check on unfolded card for the rejected scenario
    cy.get('[data-testid="ExpandMoreIcon"]').click();
    cy.get('[data-cy="scenario-owner-name"]').should('exist');
    cy.get('[data-cy="scenario-creation-date"]').should('exist');
    cy.get('[data-cy="scenario-view-redirect"]').should('contain', 'B-RejectedScenario');
    cy.get('[data-cy="scenario-status-created"]').should('contain', 'Created');
    cy.get('[data-cy="scenario-run-template"]').should('contain', 'Run template with Brewery parameters');
    cy.get('[data-cy="scenario-datasets"]').should('contain', 'Reference-for-all-scenario-creation-tests');
    cy.get('[data-cy="scenario-validation-status"]').should('contain', 'Rejected');

    //Check redirection if click on scenario name
    cy.get('[data-cy="scenario-view-redirect"]').click();
    cy.url().should('contains', 'scenario/s-');
    cy.get('[data-cy="create-scenario-button"]').should('exist');
  });

  it('PROD-13393 and PROD-13392 -> Display the About and Technical information menus', () => {
    connection.connect();
    //Check the "?" menu values
    cy.get('[data-cy="documentation-link"]').should('exist');
    cy.get('[data-cy="support-link"]').should('exist');
    cy.get('[data-cy="technical-info-button"]').should('exist');
    cy.get('[data-cy="about-button"]').should('exist');
    //Click "about" and check it opens a popup, then close it
    connection.navigate('about');
    cy.get('[role="dialog"]').should('exist');
    cy.get('[data-cy="about-dialog-close-button"]').click();
    //Click "technical information" and check it opens a popup, then close it
    connection.navigate('technical');
    cy.get('[role="dialog"]').should('exist');
    cy.get('[data-cy="technical-info-dialog-close-button"]').click();
  });
});
