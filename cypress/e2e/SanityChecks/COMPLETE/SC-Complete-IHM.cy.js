import 'cypress-file-upload';
const connection = require('../../../functions/connect.cy.js');
const datasetManager = require('../../../functions/datasetManager.cy.js');
const config = require('../../../../variables.cy.js');
const scenario = require('../../../functions/scenario.cy.js');

let testData;

describe('Global IHM and menu checks', () => {
  before(() => {
    cy.fixture('lightTestData').then((data) => {
      testData = data;
    });
  });
  it('PROD-13867 -> Scenario view & Scenario Manager - IHM - Dashboards check if no scenario', () => {
    connection.connect();
    connection.navigate('dashboards');
    cy.contains('Stocks Follow-up').click();
    cy.get(`[data-cy="${testData.ui.noScenarios.dashboards.placeholder}"]`).should('contain', testData.ui.noScenarios.dashboards.message);
  });

  it('PROD-13867 -> Scenario view & Scenario Manager - IHM - Digital Twin check if no scenario', () => {
    connection.connect();
    connection.navigate('digital-twin');
    cy.get('body').should('contain', testData.ui.noScenarios.digitalTwin.message);
  });

  it('PROD-13867 -> Scenario view & Scenario Manager - IHM Scenario View if no scenario', () => {
    connection.connect();
    connection.navigate('scenario-view');
    // Only "Create" button, share button and "Dashboard" section
    cy.get(`[data-cy="${testData.ui.buttons.createScenario}"]`).should('exist');
    cy.get(`[data-cy="${testData.ui.buttons.dashboardsAccordion}"]`).click();
    cy.get('body').should('contain', testData.ui.noScenarios.scenarioView.message);
    cy.get(`[data-cy="${testData.ui.noScenarios.dashboards.placeholder}"]`).should('contain', testData.ui.noScenarios.scenarioView.createMessage);
    cy.get(`[data-cy="${testData.ui.buttons.shareScenario}"]`).should('exist');
    cy.get(`[data-cy="${testData.ui.buttons.validateScenario}"]`).should('not.exist');
    cy.get(`[data-cy="${testData.ui.buttons.rejectScenario}"]`).should('not.exist');
    cy.get(`[data-cy="${testData.ui.buttons.launchScenario}"]`).should('not.exist');
    cy.get(`[data-cy="${testData.ui.buttons.scenarioParamsAccordion}"]`).should('not.exist');
  });

  it('PROD-13867 -> Scenario view & Scenario Manager - IHM Scenario View and Scenario Manager', () => {
    connection.connect();
    const scenarioName = testData.scenarios.testScenarios.longScenarioName;

    // Clean in case it's a second try
    scenario.deleteScenario(scenarioName);

    // Create the scenario and share for manual checks
    scenario.createScenario(scenarioName, testData.scenarios.common.branch, testData.datasets.reference.name, testData.scenarios.common.breweryParameters);
    scenario.shareScenarioWithQATeam(scenarioName, testData.sharing.qaTeam.role);

    // New buttons are available and the no scenario yet message is not anymore diplayed
    cy.get(`[data-cy="${testData.ui.buttons.createScenario}"]`).should('exist');
    cy.get(`[data-cy="${testData.ui.buttons.dashboardsAccordion}"]`).should('exist');
    cy.get(`[data-cy="${testData.ui.buttons.shareScenario}"]`).should('exist');
    cy.get(`[data-cy="${testData.ui.buttons.validateScenario}"]`).should('exist');
    cy.get(`[data-cy="${testData.ui.buttons.rejectScenario}"]`).should('exist');
    cy.get(`[data-cy="${testData.ui.buttons.launchScenario}"]`).should('exist');
    cy.get(`[data-cy="${testData.ui.buttons.scenarioParamsAccordion}"]`).should('exist');
    cy.get(`[data-cy="${testData.ui.noScenarios.dashboards.placeholder}"]`).should('not.contain', testData.ui.noScenarios.scenarioView.message);
    cy.get(`[data-cy="${testData.ui.noScenarios.dashboards.placeholder}"]`).should('not.contain', testData.ui.noScenarios.scenarioView.createMessage);

    // Run type and dataset used to create the scenario are displayed
    cy.get(`[data-cy="${testData.ui.metadata.runTemplateName}"]`).should('contain', 'Run type');
    cy.get(`[data-cy="${testData.ui.metadata.runTemplateName}"]`).should('contain', testData.ui.metadata.runTemplate);
    cy.get(`[data-cy="${testData.ui.metadata.datasetName}"]`).should('contain', 'Dataset');
    cy.get(`[data-cy="${testData.ui.metadata.datasetName}"]`).should('contain', testData.datasets.reference.name);

    // Run the scenario and check if the logs button display.
    //No check on the dashboards, as the webapp may not be connected to PowerBI.
    //A separated test will be run for that, so if the webapp is not connected, failure of these tests won't impact the whole test.
    scenario.runScenario(scenarioName);
    connection.navigate('scenario-view');
    cy.get(`[data-cy="${testData.ui.buttons.successfulRunLogs}"]`).should('exist');

    // Create scenario for validation/reject checks
    scenario.deleteScenario(testData.scenarios.testScenarios.validatedScenario);
    scenario.deleteScenario(testData.scenarios.testScenarios.rejectedScenario);
    scenario.createScenario(testData.scenarios.testScenarios.validatedScenario, testData.scenarios.common.branch, testData.datasets.reference.name, testData.scenarios.common.breweryParameters);
    scenario.validateScenario(testData.scenarios.testScenarios.validatedScenario);
    scenario.shareScenarioWithQATeam(testData.scenarios.testScenarios.validatedScenario, testData.sharing.qaTeam.role);
    scenario.createScenario(testData.scenarios.testScenarios.rejectedScenario, testData.scenarios.common.branch, testData.datasets.reference.name, testData.scenarios.common.breweryParameters);
    scenario.rejectScenario(testData.scenarios.testScenarios.rejectedScenario);
    scenario.shareScenarioWithQATeam(testData.scenarios.testScenarios.rejectedScenario, testData.sharing.qaTeam.role);

    // Check the scenario manager IHM
    connection.navigate('manager');
    cy.get(`[data-cy="${testData.ui.search.field}"]`).should('exist');
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
    scenario.searchScenarioInManager(testData.scenarios.testScenarios.validatedScenario);
    cy.get('[data-cy="scenario-view-redirect"]').should('contain', testData.scenarios.testScenarios.validatedScenario);
    cy.get('[data-cy^="scenario-accordion-"]').should('contain', testData.ui.metadata.runTemplate);
    cy.get('[data-cy^="scenario-accordion-"]').should('contain', testData.datasets.reference.name);
    // Check on unfolded card for the validated scenario
    cy.get('[data-testid="ExpandMoreIcon"]').click();
    cy.get('[data-cy="scenario-owner-name"]').should('exist');
    cy.get('[data-cy="scenario-creation-date"]').should('exist');
    cy.get('[data-cy="scenario-view-redirect"]').should('contain', testData.scenarios.testScenarios.validatedScenario);
    cy.get('[data-cy="scenario-status-created"]').should('contain', 'Created');
    cy.get('[data-cy^="scenario-accordion-"]').should('contain', 'Description');
    cy.get('[data-cy^="scenario-accordion-"]').should('contain', 'Tags');
    cy.get('[data-cy="scenario-run-template"]').should('contain', testData.ui.metadata.runTemplate);
    cy.get('[data-cy="scenario-datasets"]').should('contain', testData.datasets.reference.name);
    cy.get('[data-cy="scenario-validation-status"]').should('contain', 'Validated');

    // Check on folded card for the rejected scenario
    scenario.searchScenarioInManager(testData.scenarios.testScenarios.rejectedScenario);
    cy.get('[data-cy="scenario-view-redirect"]').should('contain', testData.scenarios.testScenarios.rejectedScenario);
    cy.get('[data-cy^="scenario-accordion-"]').should('contain', testData.ui.metadata.runTemplate);
    cy.get('[data-cy^="scenario-accordion-"]').should('contain', testData.datasets.reference.name);
    // Check on unfolded card for the rejected scenario
    cy.get('[data-testid="ExpandMoreIcon"]').click();
    cy.get('[data-cy="scenario-owner-name"]').should('exist');
    cy.get('[data-cy="scenario-creation-date"]').should('exist');
    cy.get('[data-cy="scenario-view-redirect"]').should('contain', testData.scenarios.testScenarios.rejectedScenario);
    cy.get('[data-cy="scenario-status-created"]').should('contain', 'Created');
    cy.get('[data-cy^="scenario-accordion-"]').should('contain', 'Description');
    cy.get('[data-cy^="scenario-accordion-"]').should('contain', 'Tags');
    cy.get('[data-cy="scenario-run-template"]').should('contain', testData.ui.metadata.runTemplate);
    cy.get('[data-cy="scenario-datasets"]').should('contain', testData.datasets.reference.name);
    cy.get('[data-cy="scenario-validation-status"]').should('contain', 'Rejected');

    //Check redirection if click on scenario name
    cy.get('[data-cy="scenario-view-redirect"]').click();
    cy.url().should('contains', 'scenario/s-');
    cy.get(`[data-cy="${testData.ui.buttons.createScenario}"]`).should('exist');
  });

  it('PROD-13393 and PROD-13392 -> Display the About and Technical information menus', () => {
    connection.connect();
    //Check the "?" menu values
    cy.get(`[data-cy="${testData.ui.menu.documentation}"]`).should('exist');
    cy.get(`[data-cy="${testData.ui.menu.support}"]`).should('exist');
    cy.get(`[data-cy="${testData.ui.menu.technicalInfo}"]`).should('exist');
    cy.get(`[data-cy="${testData.ui.menu.about}"]`).should('exist');
    //Click "about" and check it opens a popup, then close it
    connection.navigate('about');
    cy.get('[role="dialog"]').should('exist');
    cy.get(`[data-cy="${testData.ui.dialogs.about.closeButton}"]`).click();
    //Click "technical information" and check it opens a popup, then close it
    connection.navigate('technical');
    cy.get('[role="dialog"]').should('exist');
    cy.get(`[data-cy="${testData.ui.dialogs.technicalInfo.closeButton}"]`).click();
  });
});
