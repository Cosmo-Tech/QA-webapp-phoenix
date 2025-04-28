import 'cypress-file-upload';
var connection = require('../../functions/connect.cy.js');
var datasetManager = require('../../functions/datasetManager.cy.js');
var config = require('../../../variables.cy.js');
var scenario = require('../../functions/scenario.cy.js');

describe('Scenario View feature', () => {
  it('PROD-11815 - Validate and Reject scenario', () => {
    // Partialy tested in the IHM check but fully rechecked in this test
    connection.connect();
    scenario.deleteScenario('DLOP-PROD-11815-ScenarioView');
    scenario.createScenario('DLOP-PROD-11815-ScenarioView', 'master', 'DLOP-Reference-for-automated-tests', 'BreweryParameters');
    scenario.shareScenarioWithUser('DLOP-PROD-11815-ScenarioView', config.permissionUserEmail(), config.permissionUserName(), 'admin');

    // Validate scenario and check parameters are disabled
    scenario.validateScenario('DLOP-PROD-11815-ScenarioView');
    cy.get('[data-cy="scenario-validation-status"]').should('contain', 'Validated');
    cy.get('[data-cy="reject-scenario-button"]').should('not.exist');
    cy.get('[data-cy="disabled-input-value"]').should('exist');
    connection.navigate('manager');
    scenario.searchScenarioInManager('DLOP-PROD-11815-ScenarioView');
    cy.get('[data-cy="scenario-validation-status"]').should('contain', 'Validated');

    // Run the scenario and check the scenario is still "validated"
    connection.navigate('scenario-view');
    scenario.runScenario('DLOP-PROD-11815-ScenarioView');
    connection.navigate('scenario-view');
    cy.get('[data-cy="scenario-validation-status"]').should('contain', 'Validated');
    cy.get('[data-cy="reject-scenario-button"]').should('not.exist');
    cy.get('[data-cy="disabled-input-value"]').should('exist');
    connection.navigate('manager');
    scenario.searchScenarioInManager('DLOP-PROD-11815-ScenarioView');
    cy.get('[data-cy="scenario-validation-status"]').should('contain', 'Validated');

    // Check searching "validated" returns the validated scenario
    connection.navigate('manager');
    cy.get('#scenario-manager-search-field').click().clear().type('Validated');
    cy.wait(500);
    cy.get('[aria-label="DLOP-PROD-11815-ScenarioView"]').should('exist');

    // Remove the "Validated" status
    connection.navigate('scenario-view');
    cy.get('[data-testid="CancelIcon"]').click();
    cy.get('[data-cy="validate-scenario-button"]').should('exist');
    cy.get('[data-cy="reject-scenario-button"]').should('exist');
    cy.get('[data-cy="disabled-input-value"]').should('not.exist');
    connection.navigate('manager');
    scenario.searchScenarioInManager('DLOP-PROD-11815-ScenarioView');
    cy.get('[data-cy="scenario-validation-status"]').should('not.exist');

    // Reject the scenario and check parameters are disabled
    scenario.rejectScenario('DLOP-PROD-11815-ScenarioView');
    cy.get('[data-cy="scenario-validation-status"]').should('contain', 'Rejected');
    cy.get('[data-cy="validate-scenario-button"]').should('not.exist');
    cy.get('[data-cy="disabled-input-value"]').should('exist');
    connection.navigate('manager');
    scenario.searchScenarioInManager('DLOP-PROD-11815-ScenarioView');
    cy.get('[data-cy="scenario-validation-status"]').should('contain', 'Rejected');

    // Run the scenario and check the scenario is still "Rejected"
    scenario.runScenario('DLOP-PROD-11815-ScenarioView');
    connection.navigate('scenario-view');
    cy.get('[data-cy="scenario-validation-status"]').should('contain', 'Rejected');
    cy.get('[data-cy="validate-scenario-button"]').should('not.exist');
    cy.get('[data-cy="disabled-input-value"]').should('exist');
    connection.navigate('manager');
    scenario.searchScenarioInManager('DLOP-PROD-11815-ScenarioView');
    cy.get('[data-cy="scenario-validation-status"]').should('contain', 'Rejected');

    // Check searching "rejected" returns the validated scenario
    connection.navigate('manager');
    cy.get('#scenario-manager-search-field').click().clear().type('Rejected');
    cy.wait(500);
    cy.get('[aria-label="DLOP-PROD-11815-ScenarioView"]').should('exist');

    // Remove the "Rejected" status
    connection.navigate('scenario-view');
    cy.get('[data-testid="CancelIcon"]').click();
    cy.get('[data-cy="validate-scenario-button"]').should('exist');
    cy.get('[data-cy="reject-scenario-button"]').should('exist');
    cy.get('[data-cy="disabled-input-value"]').should('not.exist');
    connection.navigate('manager');
    scenario.searchScenarioInManager('DLOP-PROD-11815-ScenarioView');
    cy.get('[data-cy="scenario-validation-status"]').should('not.exist');

    // Run the scenario and check the scenario has still no status
    scenario.runScenario('DLOP-PROD-11815-ScenarioView');
    connection.navigate('scenario-view');
    cy.get('[data-cy="validate-scenario-button"]').should('exist');
    cy.get('[data-cy="reject-scenario-button"]').should('exist');
    cy.get('[data-cy="disabled-input-value"]').should('not.exist');
    connection.navigate('manager');
    scenario.searchScenarioInManager('DLOP-PROD-11815-ScenarioView');
    cy.get('[data-cy="scenario-validation-status"]').should('not.exist');
  });

  it('PROD-12097 - Parameters', () => {
    connection.connect();
    connection.navigate('scenario-view');
    scenario.deleteScenario('DLOP-PROD-12097-UpdateParameters');
    scenario.createScenario('DLOP-PROD-12097-UpdateParameters', 'master', 'DLOP-Reference-for-automated-tests', 'BreweryParameters');
    scenario.shareScenarioWithUser('DLOP-PROD-12097-UpdateParameters', config.permissionUserEmail(), config.permissionUserName(), 'admin');

    cy.get('[data-cy="launch-scenario-button"]').should('exist');
    //Check if the scenario parameter tab is unfolded and, if not, unfold it.
    cy.get('[data-cy="scenario-params-accordion-summary"]')
      .invoke('attr', 'aria-expanded')
      .then(($folded) => {
        if ($folded === 'false') {
          cy.get('[data-cy="scenario-params-accordion-summary"]').click();
        }
      });

    // These parameters are for Brewery. If it's another solution that is tested, duplicate this test and update the parameters
    // PUB tab
    cy.get('[data-cy="bar_parameters_tab"]').should('exist');
    cy.get('[id="number-input-stock"]').should('exist');
    cy.get('[id="number-input-restock_qty"]').should('exist');
    cy.get('[id="number-input-nb_waiters"]').should('exist');
    // INITIAL VALUES tab
    cy.get('[data-cy="file_upload_tab"]').should('exist');
    cy.get('[data-cy="file_upload_tab"]').click();
    cy.get('[data-cy="label-disabled-input"]').should('exist');
    cy.get('[data-cy="browse-button"]').should('exist');
    // No save or discard yet (parameters not updated yet)
    cy.get('[data-cy="save-button"]').should('not.exist');
    cy.get('[data-cy="discard-button"]').should('not.exist');
    cy.get('[data-cy="save-and-launch-label"]').should('not.exist');

    //Try wrong values, check error message and only discard button is available.
    cy.get('[data-cy="bar_parameters_tab"]').click();
    cy.get('[id="number-input-stock"]').click().clear();
    cy.get('[id="number-input-stock-helper-text"]').should('contain', 'This field is required');
    cy.get('[data-cy="save-button"]').should('be.disabled');
    cy.get('[data-cy="launch-scenario-button"]').should('be.disabled');
    cy.get('[id="number-input-stock"]').click().type('aaa');
    cy.get('[id="number-input-stock-helper-text"]').should('contain', 'This field is required');
    cy.get('[data-cy="save-button"]').should('be.disabled');
    cy.get('[data-cy="launch-scenario-button"]').should('be.disabled');
    cy.get('[id="number-input-stock"]').click().type('1.1');
    cy.get('[id="number-input-stock-helper-text"]').should('contain', 'This value must be an integer');
    cy.get('[data-cy="save-button"]').should('be.disabled');
    cy.get('[data-cy="launch-scenario-button"]').should('be.disabled');

    cy.get('[id="number-input-restock_qty"]').click().clear();
    cy.get('[id="number-input-restock_qty-helper-text"]').should('contain', 'This field is required');
    cy.get('[data-cy="save-button"]').should('be.disabled');
    cy.get('[data-cy="launch-scenario-button"]').should('be.disabled');
    cy.get('[id="number-input-restock_qty"]').click().type('aaa');
    cy.get('[id="number-input-restock_qty-helper-text"]').should('contain', 'This field is required');
    cy.get('[data-cy="save-button"]').should('be.disabled');
    cy.get('[data-cy="launch-scenario-button"]').should('be.disabled');
    cy.get('[id="number-input-restock_qty"]').click().type('1.1');
    cy.get('[id="number-input-restock_qty-helper-text"]').should('contain', 'This value must be an integer');
    cy.get('[data-cy="save-button"]').should('be.disabled');
    cy.get('[data-cy="launch-scenario-button"]').should('be.disabled');

    cy.get('[id="number-input-nb_waiters"]').click().clear();
    cy.get('[id="number-input-nb_waiters-helper-text"]').should('contain', 'This field is required');
    cy.get('[data-cy="save-button"]').should('be.disabled');
    cy.get('[data-cy="launch-scenario-button"]').should('be.disabled');
    cy.get('[id="number-input-nb_waiters"]').click().type('aaa');
    cy.get('[id="number-input-nb_waiters-helper-text"]').should('contain', 'This field is required');
    cy.get('[data-cy="save-button"]').should('be.disabled');
    cy.get('[data-cy="launch-scenario-button"]').should('be.disabled');
    cy.get('[id="number-input-nb_waiters"]').click().type('1.1');
    cy.get('[id="number-input-nb_waiters-helper-text"]').should('contain', 'This value must be an integer');
    cy.get('[data-cy="save-button"]').should('be.disabled');
    cy.get('[data-cy="launch-scenario-button"]').should('be.disabled');

    //Update the three values
    cy.get('[id="number-input-stock"]').click().clear().type('50');
    cy.get('[id="number-input-restock_qty"]').click().clear().type('20');
    cy.get('[id="number-input-nb_waiters"]').click().clear().type('10');

    // The three buttons are now available and the create, share, validate and reject buttons are disabled
    cy.get('[data-cy="save-button"]').should('exist');
    cy.get('[data-cy="discard-button"]').should('exist');
    cy.get('[data-cy="save-and-launch-label"]').should('exist');
    cy.get('[aria-label="Please save or discard current modifications before creating a new scenario"]').should('exist');
    cy.get('[data-cy="create-scenario-button"]').should('be.disabled');
    cy.get('[aria-label="Please save or discard current modifications before changing the scenario access permissions"]').should('exist');
    cy.get('[data-cy="share-scenario-button"]').should('be.disabled');
    cy.get('[aria-label="Please save or discard current modifications before changing the scenario validation status"]').should('exist');
    cy.get('[data-cy="validate-scenario-button"]').should('be.disabled');
    cy.get('[data-cy="reject-scenario-button"]').should('be.disabled');
    cy.get('[aria-label="Please save or discard current modifications before selecting another scenario"]').should('exist');
    cy.get('[placeholder="Scenario"]').should('be.disabled');

    // Change tab then cancel
    cy.get('[data-cy="tabs.scenariomanager.key"]').click({ force: true });
    cy.get('[data-cy="discard-and-continue-dialog-body"]').should('have.text', 'You have unsaved parameters that will be lost if you continue.');
    cy.get('[data-cy="discard-and-continue-button1"]').click();
    cy.wait(2000);
    // Check cancelation did nothing, parameters are still in edition mode
    cy.get('[data-cy="save-button"]').should('exist');
    cy.get('[data-cy="discard-button"]').should('exist');
    cy.get('[data-cy="save-and-launch-label"]').should('exist');
    cy.get('[aria-label="Please save or discard current modifications before creating a new scenario"]').should('exist');
    cy.get('[data-cy="create-scenario-button"]').should('be.disabled');
    cy.get('[aria-label="Please save or discard current modifications before changing the scenario access permissions"]').should('exist');
    cy.get('[data-cy="share-scenario-button"]').should('be.disabled');
    cy.get('[aria-label="Please save or discard current modifications before changing the scenario validation status"]').should('exist');
    cy.get('[data-cy="validate-scenario-button"]').should('be.disabled');
    cy.get('[data-cy="reject-scenario-button"]').should('be.disabled');
    cy.get('[aria-label="Please save or discard current modifications before selecting another scenario"]').should('exist');
    cy.get('[placeholder="Scenario"]').should('be.disabled');

    // Change tab then confirm
    cy.get('[data-cy="tabs.scenariomanager.key"]').click({ force: true });
    cy.get('[data-cy="discard-and-continue-dialog-body"]').should('have.text', 'You have unsaved parameters that will be lost if you continue.');
    cy.get('[data-cy="discard-and-continue-button2"]').click();
    cy.wait(2000);
    // Go back to scenario view and check the parameters are the original one, and no longer in edition mode
    connection.navigate('scenario-view');
    cy.get('[id="number-input-stock"]').should('have.value', '100');
    cy.get('[id="number-input-restock_qty"]').should('have.value', '25');
    cy.get('[id="number-input-nb_waiters"]').should('have.value', '5');
    cy.get('[data-cy="save-button"]').should('not.exist');
    cy.get('[data-cy="discard-button"]').should('not.exist');
    cy.get('[data-cy="save-and-launch-label"]').should('not.exist');

    //Update the three values
    cy.get('[id="number-input-stock"]').click().clear().type('50');
    cy.get('[id="number-input-restock_qty"]').click().clear().type('20');
    cy.get('[id="number-input-nb_waiters"]').click().clear().type('10');

    //Discard, cancel and check the value are the updated ones
    cy.get('[data-cy="discard-button"]').click();
    cy.get('[data-cy="discard-changes-button1"]').click();
    cy.get('[id="number-input-stock"]').should('have.value', '50');
    cy.get('[id="number-input-restock_qty"]').should('have.value', '20');
    cy.get('[id="number-input-nb_waiters"]').should('have.value', '10');
    // Save or discard buttons still here
    cy.get('[data-cy="save-button"]').should('exist');
    cy.get('[data-cy="discard-button"]').should('exist');
    cy.get('[data-cy="save-and-launch-label"]').should('exist');

    //Discard, confirm and check the value are the initial ones
    cy.get('[data-cy="discard-button"]').click();
    cy.get('[data-cy="discard-changes-button2"]').click();
    cy.get('[id="number-input-stock"]').should('have.value', '100');
    cy.get('[id="number-input-restock_qty"]').should('have.value', '25');
    cy.get('[id="number-input-nb_waiters"]').should('have.value', '5');
    // No save or discard buttons
    cy.get('[data-cy="save-button"]').should('not.exist');
    cy.get('[data-cy="discard-button"]').should('not.exist');
    cy.get('[data-cy="save-and-launch-label"]').should('not.exist');

    //Update values and save
    cy.get('[id="number-input-stock"]').click().clear().type('50');
    cy.get('[id="number-input-restock_qty"]').click().clear().type('20');
    cy.get('[id="number-input-nb_waiters"]').click().clear().type('10');
    cy.get('[data-cy="save-button"]').click();
    // No more save or discard buttons
    cy.get('[data-cy="save-button"]').should('not.exist');
    cy.get('[data-cy="discard-button"]').should('not.exist');
    cy.get('[data-cy="save-and-launch-label"]').should('not.exist');

    //Update values and save & launch
    cy.get('[id="number-input-stock"]').click().clear().type('20');
    cy.get('[id="number-input-restock_qty"]').click().clear().type('2');
    cy.get('[id="number-input-nb_waiters"]').click().clear().type('1');
    cy.get('[data-cy="launch-scenario-button"]').click();
    // Check the scenario has run
    cy.wait(5000);
    // Wait until the end of the simulation (5 min timeout)
    cy.get('[data-cy="stop-scenario-run-button"]', { timeout: 300000 }).should('not.exist');
    // Check the simulation is successful
    connection.navigate('manager');
    scenario.searchScenarioInManager('DLOP-PROD-12097-UpdateParameters');
    cy.wait(500);
    cy.get('[data-cy*="scenario-accordion-"]').click();
    cy.wait(500);
    cy.get('[data-cy="scenario-status-successful"]').should('exist');
  });

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
    // Removed from the test because if the action takes less than 10s, the text doesn't display
    //cy.get('[data-cy="running-state-label"]', { timeout: 300000 }).should('have.text', 'Transferring results');
    //cy.get('[data-cy="dashboard-placeholder"]', { timeout: 300000 }).should('have.text', 'Transfer of scenario results in progress...');

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

  it('PROD-14374: Launch impossible if dataset in error', () => {
    connection.connect();
    var datasetName = 'DLOP-PROD-14374';

    // Clean in case it's a second try
    datasetManager.deleteDataset(datasetName);
    scenario.deleteScenario(datasetName);

    connection.navigate('dataset');
    // Create the dataset
    datasetManager.createDatasetLocalFile(datasetName, 'A basic reference dataset for brewery model', 'reference');
    datasetManager.shareDatasetUser(datasetName, config.permissionUserEmail(), config.permissionUserName(), 'admin');

    // Create the scenario and run it
    scenario.createScenario(datasetName, 'master', datasetName, 'BreweryParameters');
    scenario.runScenario(datasetName);

    // Go back to dataset overview and refresh the dataset with wrong data
    connection.navigate('dataset');
    datasetManager.searchDataset(datasetName);
    cy.get('[id^="dataset-reupload-input"]').selectFile('cypress/fixtures/datasets/PROD-14374/FalseDataset.zip', { force: true });
    cy.wait(1000);

    // Confirm update failed
    cy.get('[data-cy="dataset-overview-title"]').should('have.text', 'An error occurred during import of your data');
    cy.get('[data-cy*="dataset-reupload-button"]').should('exist');

    // Go back to scenario and check the launch button is disabled
    scenario.searchScenarioInView(datasetName);
    cy.get('[data-cy="launch-scenario-button"]').should('be.disabled');
    // Check the tooltip display the correct message
    cy.get('[aria-label="The scenario cannot be run because its dataset isn\'t found or its data ingestion has failed"]').should('exist');

    // Update the value of a parameter
    cy.get('[id="number-input-stock"]').click().clear().type('50');

    // Check you can only save or discard, not launch
    cy.get('[data-cy="save-button"]').should('exist');
    cy.get('[data-cy="discard-button"]').should('exist');
    cy.get('[aria-label="The scenario cannot be run because its dataset isn\'t found or its data ingestion has failed"]').should('exist');
    cy.get('[data-cy="launch-scenario-button"]').should('be.disabled');

    // Click on discard to avoid later issue
    cy.get('[data-cy="discard-button"]').click();
    cy.get('[data-cy="discard-changes-button2"]').click();
  });
});
