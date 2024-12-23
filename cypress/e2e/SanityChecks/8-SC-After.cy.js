import 'cypress-file-upload';
var connection = require('../../functions/connect.cy.js');
var datasetManager = require('../../functions/datasetManager.cy.js');
var config = require('../../../variables.cy.js');
var scenario = require('../../functions/scenario.cy.js');

describe('To use after the sanity check and the manual checks', () => {
  it('Clean all dataset and scenario resulting of the sanity check', () => {
    connection.connect();
    connection.navigate('manager');
    scenario.deleteAllScenario();
    connection.navigate('dataset');
    datasetManager.deleteDataset('DLOP-Reference-for-automated-tests');
    datasetManager.deleteDataset('DLOP-PROD-13240-Admin');
    datasetManager.deleteDataset('DLOP-PROD-13240-Editor');
    datasetManager.deleteDataset('DLOP-PROD-13240-Viewer');
  });
});
