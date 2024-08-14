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
    scenario.deleteScenario('PROD-11884-MasterLevel-1');
    scenario.deleteScenario('PROD-11884-MasterLevel-2');
    scenario.deleteScenario('PROD-11884-ChildrenA-Lvl2');
    scenario.deleteScenario('PROD-11884-ChildrenB-Lvl2');
    scenario.deleteScenario('PROD-11884-ChildrenA.A-Lvl3');
    scenario.deleteScenario('PROD-11884-ChildrenA.B-Lvl3');
    scenario.deleteScenario('PROD-11884-ChildrenA.C-Lvl3');
    scenario.deleteScenario('PROD-11884-ChildrenB.A-Lvl3');
    scenario.deleteScenario('PROD-11884-ChildrenB.B-Lvl3');
    scenario.deleteScenario('PROD-11884-ChildrenA.B.A-Lvl4');
    scenario.deleteScenario('PROD-11884-ChildrenA.B.B-Lvl4');
    scenario.deleteScenario('PROD-11884-ChildrenA.C.A-Lvl4');
    scenario.deleteScenario('PROD-11884-ChildrenB.B.A-Lvl4');
    scenario.deleteScenario('PROD-11884-ChildrenB.B.B-Lvl4');
    scenario.deleteScenario('PROD-11884-MasterChildrenA-Lvl2');
    scenario.deleteScenario('PROD-11884-MasterChildrenB-Lvl2');
    scenario.deleteScenario('PROD-11884-MasterChildrenC-Lvl2');
    scenario.deleteScenario('PROD-11884-MasterChildrenA.A-Lvl3');

    connection.navigate('dataset');
    datasetManager.deleteDataset('Reference-for-all-scenario-creation-tests');
  });
});
