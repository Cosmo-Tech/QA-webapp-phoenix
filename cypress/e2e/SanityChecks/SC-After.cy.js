import 'cypress-file-upload';
const connection = require('../../functions/connect.cy.js');
const datasetManager = require('../../functions/datasetManager.cy.js');
const config = require('../../../variables.cy.js');
const scenario = require('../../functions/scenario.cy.js');

describe('To use after the sanity check and the manual checks', () => {
  it('Clean all scenarios resulting of the sanity check (fail if no scenario)', () => {
    connection.connect();
    // Delete scenarios
    connection.navigate('manager');
    scenario.deleteScenario('DLOP-PROD-13867-ThisIsAVeryLongScenarioNameSoThreeDotsWillDisplaysInsteadOfCompleteNameToCheckSpecs');
    scenario.deleteScenario('A-ValidatedScenario');
    scenario.deleteScenario('B-RejectedScenario');
    scenario.deleteScenario('DLOP-PROD-14373');
    scenario.deleteScenario('DLOP-PROD-13240-Admin');
    scenario.deleteScenario('DLOP-PROD-13240-Editor');
    scenario.deleteScenario('DLOP-PROD-13240-Viewer');
    scenario.deleteScenario('DLOP-PROD-11884-MasterLevel-A');
    scenario.deleteScenario('DLOP-PROD-11884-MasterLevel-B');
    scenario.deleteScenario('DLOP-PROD-11884-Children-A-A');
    scenario.deleteScenario('DLOP-PROD-11884-Children-A-B');
    scenario.deleteScenario('DLOP-PROD-11884-Children-B-A');
    scenario.deleteScenario('DLOP-PROD-11884-Children-A-A-A');
    scenario.deleteScenario('DLOP-PROD-11884-Children-A-A-B');
    scenario.deleteScenario('DLOP-PROD-13885-ChildDescriptionAndTag');
    scenario.deleteScenario('DLOP-PROD-13885-MasterDescriptionAndTag');
    scenario.deleteScenario('Updated-DLOP-PROD-13878');
    scenario.deleteScenario('DLOP-PROD-13739-Admin');
    scenario.deleteScenario('DLOP-PROD-13739-Validator');
    scenario.deleteScenario('DLOP-PROD-13739-Editor');
    scenario.deleteScenario('DLOP-PROD-13739-Viewer');
    scenario.deleteScenario('DLOP-EditableTables');
    scenario.deleteScenario('DLOP-PROD-12097-UpdateParameters');
    scenario.deleteScenario('DLOP-PROD-13235-OverwritePermissions');
    scenario.deleteScenario('PROD-13750-DashboardsChecks-Run');
    scenario.deleteScenario('PROD-13751-DigitalTwin');
  });

  it('Clean all datasets resulting of the sanity check', () => {
    connection.connect();
    // Delete datasets
    connection.navigate('dataset');
    datasetManager.deleteDataset('DLOP-Reference-for-automated-tests');
    datasetManager.deleteDataset('DLOP-Barcelona-for-automated-tests');
    datasetManager.deleteDataset('DLOP-PROD-13240-Admin');
    datasetManager.deleteDataset('DLOP-PROD-13240-Editor');
    datasetManager.deleteDataset('DLOP-PROD-13240-Viewer');
    datasetManager.deleteDataset('DLOP-PROD-14373');
    datasetManager.deleteDataset('DLOP-PROD-13888-CheckOverview');
    datasetManager.deleteDataset('DLOP-PROD-13235-OverwritePermissions');
    datasetManager.deleteDataset('DLOP-PROD-13236-NoPermissions');
  });
});
