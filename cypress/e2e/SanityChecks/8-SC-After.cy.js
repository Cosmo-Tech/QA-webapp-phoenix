import 'cypress-file-upload';
var connection = require('../../functions/connect.cy.js');
var datasetManager = require('../../functions/datasetManager.cy.js');
var config = require('../../../variables.cy.js');
var scenario = require('../../functions/scenario.cy.js');

describe('To use after the sanity check and the manual checks', () => {
  it('Clean all scenarios resulting of the sanity check (fail if no scenario)', () => {
    connection.connect();
    // Delete scenarios
    connection.navigate('manager');
    scenario.deleteAllScenario();
  });

  it('Clean all datasets resulting of the sanity check', () => {
    connection.connect();
    // Delete datasets
    connection.navigate('dataset');
    datasetManager.deleteDataset('DLOP-Reference-for-automated-tests');
    datasetManager.deleteDataset('DLOP-PROD-13240-Admin');
    datasetManager.deleteDataset('DLOP-PROD-13240-Editor');
    datasetManager.deleteDataset('DLOP-PROD-13240-Viewer');
    datasetManager.deleteDataset('DLOP-PROD-14373');
  });
});
