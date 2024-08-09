import 'cypress-file-upload';
var connection = require('../../functions/connect.cy.js');
var datasetManager = require('../../functions/datasetManager.cy.js');
var config = require('../../../variables.cy.js');
var scenario = require('../../functions/scenario.cy.js');

describe('To use after the sanity check and the manual checks', () => {
  it('Clean all dataset and scenario resulting of the sanity check', () => {
    connection.connect();
    connection.navigate('manager');
    scenario.deleteScenario('PROD-13240-Admin');
    scenario.deleteScenario('PROD-13240-Editor');
    scenario.deleteScenario('PROD-13240-Viewer');
    scenario.deleteScenario('PROD-11913-ThisIsAVeryLongScenarioNameSoThreeDotsWillDisplaysInsteadOfCompleteNameToCheckSpecs');
    scenario.deleteScenario('A-ValidatedScenario');
    scenario.deleteScenario('B-RejectedScenario');

    connection.navigate('dataset');
    datasetManager.deleteDataset('Reference-for-all-scenario-creation-tests');
  });
});
