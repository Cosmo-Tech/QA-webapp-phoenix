import 'cypress-file-upload';
const connection = require('../../functions/connect.cy.js');
const datasetManager = require('../../functions/datasetManager.cy.js');
const config = require('../../../variables.cy.js');
const scenario = require('../../functions/scenario.cy.js');

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

    // Clean (manual checks will be done on the validated/rejected scenarios created in another test)
    scenario.deleteScenario('DLOP-PROD-11815-ScenarioView');
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

    // Clean the scenario
    scenario.deleteScenario('DLOP-PROD-12097-UpdateParameters');
  });

  it('PROD-13345 and PROD-14374: Launch impossible if dataset in error', () => {
    connection.connect();
    const datasetName = 'DLOP-PROD-14374';

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
    cy.get('[id^="dataset-reupload-input"]').selectFile('cypress/fixtures/datasets/FalseDataset.zip', { force: true });
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

    // Clean as no manual check is needed
    datasetManager.deleteDataset(datasetName);
    scenario.deleteScenario(datasetName);
  });
});
