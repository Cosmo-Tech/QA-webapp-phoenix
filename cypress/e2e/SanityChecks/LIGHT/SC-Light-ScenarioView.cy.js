import 'cypress-file-upload';
const connection = require('../../../functions/connect.cy.js');
const datasetManager = require('../../../functions/datasetManager.cy.js');
const config = require('../../../../variables.cy.js');
const scenario = require('../../../functions/scenario.cy.js');

describe('Scenario View feature', () => {
  it('PROD-13885, PROD-13883, PROD-13884 and PROD-11884: Create a master/child scenario', () => {
    connection.connect();
    // Delete all scenarios created in this test, in case it's a second try
    scenario.deleteScenario('DLOP-PROD-11884-MasterLevel-A');
    scenario.deleteScenario('DLOP-PROD-11884-MasterLevel-B');
    scenario.deleteScenario('DLOP-PROD-11884-Children-A-A');
    scenario.deleteScenario('DLOP-PROD-11884-Children-A-B');
    scenario.deleteScenario('DLOP-PROD-11884-Children-B-A');
    scenario.deleteScenario('DLOP-PROD-11884-Children-A-A-A');
    scenario.deleteScenario('DLOP-PROD-11884-Children-A-A-B');
    scenario.deleteScenario('DLOP-PROD-13885-ChildDescriptionAndTag');
    scenario.deleteScenario('DLOP-PROD-13885-MasterDescriptionAndTag');

    // Create all scenarios
    connection.navigate('scenario-view');
    scenario.createScenario('DLOP-PROD-11884-MasterLevel-A', 'master', 'DLOP-Reference-for-automated-tests', 'Run');
    scenario.shareScenarioWithUser('DLOP-PROD-11884-MasterLevel-A', config.permissionUserEmail(), config.permissionUserName(), 'admin');
    scenario.createScenario('DLOP-PROD-11884-MasterLevel-B', 'master', 'DLOP-Reference-for-automated-tests', 'Run');
    scenario.shareScenarioWithUser('DLOP-PROD-11884-MasterLevel-B', config.permissionUserEmail(), config.permissionUserName(), 'admin');

    scenario.createScenario('DLOP-PROD-11884-Children-A-A', 'child', 'DLOP-PROD-11884-MasterLevel-A', 'Run');
    scenario.shareScenarioWithUser('DLOP-PROD-11884-Children-A-A', config.permissionUserEmail(), config.permissionUserName(), 'admin');
    scenario.createScenario('DLOP-PROD-11884-Children-A-B', 'child', 'DLOP-PROD-11884-MasterLevel-A', 'Run');
    scenario.shareScenarioWithUser('DLOP-PROD-11884-Children-A-B', config.permissionUserEmail(), config.permissionUserName(), 'admin');
    scenario.createScenario('DLOP-PROD-11884-Children-B-A', 'child', 'DLOP-PROD-11884-MasterLevel-B', 'Run');
    scenario.shareScenarioWithUser('DLOP-PROD-11884-Children-B-A', config.permissionUserEmail(), config.permissionUserName(), 'admin');

    scenario.createScenario('DLOP-PROD-11884-Children-A-A-A', 'child', 'DLOP-PROD-11884-Children-A-A', 'Run');
    scenario.shareScenarioWithUser('DLOP-PROD-11884-Children-A-A-A', config.permissionUserEmail(), config.permissionUserName(), 'admin');
    scenario.createScenario('DLOP-PROD-11884-Children-A-A-B', 'child', 'DLOP-PROD-11884-Children-A-A', 'Run');
    scenario.shareScenarioWithUser('DLOP-PROD-11884-Children-A-A-B', config.permissionUserEmail(), config.permissionUserName(), 'admin');

    //Run scenarios (to check parent or child scenarios can be run)
    scenario.runScenario('DLOP-PROD-11884-MasterLevel-A');
    scenario.runScenario('DLOP-PROD-11884-Children-A-A-A');
    scenario.runScenario('DLOP-PROD-11884-Children-B-A');

    // Specific test added for the description and tag fields
    // Create a master scenario with a description and a tag
    connection.navigate('scenario-view');
    cy.get('[data-cy="create-scenario-button"]').click({ force: true });
    cy.get('#scenarioName').click().type('DLOP-PROD-13885-MasterDescriptionAndTag');
    cy.get('[data-cy="create-scenario-dialog-master-checkbox"]').click({ force: true });
    cy.get('[placeholder="Select a dataset"]').click().clear().type('DLOP-Reference-for-automated-tests').type('{downarrow}{enter}');
    cy.get('[id="scenarioType"]').click({ force: true });
    cy.get('[id="scenarioType"]').click().clear().type('Run template with Brewery parameters').type('{downarrow}{enter}');
    cy.get('[data-cy="text-input-new-scenario-description"]').click({ force: true }).clear().type('This is a master scenario');
    // Add the tag Master, try to add again this tag and finaly enter a tag without validation
    cy.get('[id="new-scenario-tags"]')
      .click({ force: true })
      .clear()
      .type('MasterParentScenario' + '{enter}')
      .type('MasterParentScenario' + '{enter}')
      .type('NotValidated');
    // Validate the scenario creation
    cy.get('[data-cy="create-scenario-dialog-submit-button"]').click({ force: true });
    cy.wait(1000);

    // Go to scenario manager, search the scenario, make sure there is only one tag
    connection.navigate('manager');
    scenario.searchScenarioInManager('DLOP-PROD-13885-MasterDescriptionAndTag');
    cy.get('[data-cy="scenario-tags-tag-1"]').should('not.exist');

    // Try to create child scenario and check the description and tags from the parent are not displayed
    connection.navigate('scenario-view');
    cy.get('[data-cy="create-scenario-button"]').click({ force: true });
    cy.get('#scenarioName').click().type('DLOP-PROD-13885-ChildDescriptionAndTag');
    cy.get('[placeholder="Parent Scenario"]').click().clear().type('DLOP-PROD-13885-MasterDescriptionAndTag').type('{downarrow}{enter}');
    cy.get('[role="dialog"]').should('not.contain', 'This is a master scenario');
    cy.get('[role="dialog"]').should('not.contain', 'MasterParentScenario');
    // Validate the scenario creation
    cy.get('[data-cy="create-scenario-dialog-submit-button"]').click({ force: true });
    cy.wait(1000);

    scenario.shareScenarioWithUser('DLOP-PROD-13885-ChildDescriptionAndTag', config.permissionUserEmail(), config.permissionUserName(), 'admin');
    scenario.shareScenarioWithUser('DLOP-PROD-13885-MasterDescriptionAndTag', config.permissionUserEmail(), config.permissionUserName(), 'admin');
  });

  it('PROD-11883 and PROD-11809: Create and run scenario', () => {
    connection.connect();
    // Delete all scenarios created in this test, in case it's a second try
    scenario.deleteScenario('DLOP-PROD-11883-CheckCreationForm');

    // Check the creation popup elements
    connection.navigate('scenario-view');
    cy.get('[data-cy="create-scenario-button"]').click({ force: true });
    cy.get('[id="form-dialog-title"]').should('have.text', 'Create new scenario');
    cy.get('[id="scenarioName-label"]').should('have.text', 'Scenario name');
    cy.get('[id="scenarioName"]').should('exist');
    cy.get('[data-cy="text-input-new-scenario-description"]').should('exist');
    cy.get('[id="new-scenario-tags-label"]').should('exist');
    cy.get('[data-testid="CheckBoxOutlineBlankIcon"]').should('exist');
    cy.get('[role="dialog"]').should('contain', 'Master');
    cy.get('[id="scenarioType-label"]').should('have.text', 'Run Type');
    cy.get('[id="scenarioType"]').should('exist');
    cy.get('[data-cy="scenario-select-input"').should('contain', 'Parent Scenario');
    cy.get('[data-cy="create-scenario-dialog-cancel-button"]').should('not.be.disabled');
    cy.get('[data-cy="create-scenario-dialog-submit-button"]').should('be.disabled');

    //Click anywhere and check "scenario name can't be empty" warning
    cy.get('[placeholder="Parent Scenario"]').click().type('{esc}');
    cy.get('[id="scenarioName-helper-text"]').should('have.text', 'Scenario name cannot be empty');
    cy.get('[data-cy="create-scenario-dialog-submit-button"]').should('be.disabled');

    //Try different special characters and check warning message + create button disabled for each
    cy.get('[id="scenarioName"]').click().clear().type('?');
    cy.get('[data-cy="create-scenario-dialog-submit-button"]').should('not.be.disabled');
    cy.get('[id="scenarioName"]').click().clear().type('$');
    cy.get('[data-cy="create-scenario-dialog-submit-button"]').should('not.be.disabled');
    cy.get('[id="scenarioName"]').click().clear().type('%');
    cy.get('[data-cy="create-scenario-dialog-submit-button"]').should('not.be.disabled');
    cy.get('[id="scenarioName"]').click().clear().type('é');
    cy.get('[data-cy="create-scenario-dialog-submit-button"]').should('not.be.disabled');
    cy.get('[id="scenarioName"]').click().clear().type('#');
    cy.get('[data-cy="create-scenario-dialog-submit-button"]').should('not.be.disabled');
    cy.get('[id="scenarioName"]').click().clear().type('€');
    cy.get('[data-cy="create-scenario-dialog-submit-button"]').should('not.be.disabled');
    cy.get('[id="scenarioName"]').click().clear().type('@');
    cy.get('[data-cy="create-scenario-dialog-submit-button"]').should('not.be.disabled');
    cy.get('[id="scenarioName"]').click().clear().type('(');
    cy.get('[data-cy="create-scenario-dialog-submit-button"]').should('not.be.disabled');
    cy.get('[id="scenarioName"]').click().clear().type('&');
    cy.get('[data-cy="create-scenario-dialog-submit-button"]').should('not.be.disabled');
    cy.get('[id="scenarioName"]').click().clear().type('+');
    cy.get('[data-cy="create-scenario-dialog-submit-button"]').should('not.be.disabled');
    cy.get('[id="scenarioName"]').click().clear().type('ç');
    cy.get('[data-cy="create-scenario-dialog-submit-button"]').should('not.be.disabled');
    cy.get('[id="scenarioName"]').click().clear().type('"');
    cy.get('[data-cy="create-scenario-dialog-submit-button"]').should('not.be.disabled');

    // Enter a valid name
    cy.get('[id="scenarioName"]').click().clear().type('3e-.Z90 RTE_FR');
    cy.get('[id="scenarioName-helper-text"]').should('not.exist');
    cy.get('[data-cy="create-scenario-dialog-submit-button"]').should('not.be.disabled');

    // Check master, Parent Scenario change in Dataset
    cy.get('[data-cy="create-scenario-dialog-master-checkbox"]').click({ force: true });
    cy.get('[id="dataset-label"]').should('have.text', 'Dataset');
    cy.get('[placeholder="Select a dataset"]').should('exist');

    // Cancel creation and check the scenario is not in the list
    cy.get('[data-cy="create-scenario-dialog-cancel-button"]').click();
    cy.get('[placeholder="Scenario"]').type('3e-.Z90 RTE_FR', { force: true });
    cy.wait(500);
    cy.get('[role="presentation"').should('contain', 'No options');

    // Create scenario
    scenario.createScenario('DLOP-PROD-11883-CheckCreationForm', 'master', 'DLOP-Reference-for-automated-tests', 'BreweryParameters');

    // Check if the dashboard tab is unfolded and, if not, unfold it.
    cy.get('[data-cy="dashboards-accordion-summary"]')
      .invoke('attr', 'aria-expanded')
      .then(($folded) => {
        if ($folded === 'false') {
          cy.get('[data-cy="dashboards-accordion-summary"]').click();
        }
      });

    // Check scenario has not run yet message
    cy.get('[data-cy="dashboard-placeholder"]').should('have.text', 'The scenario has not been run yet');

    // Try to create a scenario with same name
    cy.get('[data-cy="create-scenario-button"]').click({ force: true });
    cy.get('#scenarioName').click().type('DLOP-PROD-11883-CheckCreationForm');
    cy.get('[id="scenarioName-helper-text"]').should('have.text', 'Scenario name already exists');
    cy.get('[data-cy="create-scenario-dialog-submit-button"]').should('be.disabled');
    cy.get('[data-cy="create-scenario-dialog-cancel-button"]').click();

    // Run the scenario and check the steps (so no use of the function, to control the intermediate messages)
    scenario.searchScenarioInView('DLOP-PROD-11883-CheckCreationForm');
    // Run the scenario
    cy.get('[data-cy="launch-scenario-button"]').click();
    cy.wait(500);
    cy.get('[data-cy="stop-scenario-run-button"]', { timeout: 300000 }).should('exist');
    cy.get('[data-cy="running-state-spinner"]', { timeout: 300000 }).should('exist');
    // Check the different steps (5 min timeout each)
    cy.get('[data-cy="running-state-label"]', { timeout: 300000 }).should('have.text', 'Running');
    cy.get('[data-cy="dashboard-placeholder"]', { timeout: 300000 }).should('have.text', 'Scenario run in progress...');

    // Wait until the end of the simulation (5 min timeout)
    cy.get('[data-cy="stop-scenario-run-button"]', { timeout: 300000 }).should('not.exist');
    // Check the simulation is successful
    connection.navigate('manager');
    scenario.searchScenarioInManager('DLOP-PROD-11883-CheckCreationForm');
    cy.wait(500);
    cy.get('[data-cy*="scenario-accordion-"]').click();
    cy.wait(5000);
    cy.get('[data-cy="scenario-status-successful"]').should('exist');

    // Run and abort, but cancel the abort
    connection.navigate('scenario-view');
    cy.get('[data-cy="launch-scenario-button"]').click();
    cy.get('[data-cy="stop-scenario-run-button"]').click();
    cy.get('[id="cancel-runid-button1"]').click();
    cy.get('[data-cy="stop-scenario-run-button"]').should('exist');

    // Abort the run
    cy.get('[data-cy="stop-scenario-run-button"]').click();
    cy.get('[id="cancel-runid-button2"]').click();
    cy.wait(500);
    // Check error message and log button
    cy.get('[data-cy="dashboard-placeholder"]').should('have.text', 'An error occurred during the scenario run');
    cy.get('[type="button"]').should('contain', 'Download logs');
    // Check the simulation is failed
    connection.navigate('manager');
    scenario.searchScenarioInManager('DLOP-PROD-11883-CheckCreationForm');
    cy.wait(500);
    cy.get('[data-cy*="scenario-accordion-"]').click();
    cy.wait(500);
    cy.get('[data-cy="scenario-status-failed"]').should('exist');

    // Run again the scenario to check the previous abort did not impact the scenario
    scenario.runScenario('DLOP-PROD-11883-CheckCreationForm');

    // Delete the scenario (manual tests to complete this test can be done on any other remaining scenario)
    scenario.deleteScenario('DLOP-PROD-11883-CheckCreationForm');
  });
});
