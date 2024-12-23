import 'cypress-file-upload';
var connection = require('../../functions/connect.cy.js');
var datasetManager = require('../../functions/datasetManager.cy.js');
var config = require('../../../variables.cy.js');
var scenario = require('../../functions/scenario.cy.js');

describe('To run before any automated sanity check', () => {
  // Clean all scenario to have the "no scenario" messages in different screens
  it('Delete All Senario | May fail if no scenario', () => {
    connection.connect();
    scenario.deleteAllScenario();
  });

  it('Create a dataset for any scenario creations during the automated tests', () => {
    //Create a dataset that will be needed during all test that create scenarios with no specific dataset required. This dataset will be removed at the end of the tests in the After.cy.js tests.
    connection.connect();
    connection.navigate('dataset');
    var datasetName = 'DLOP-Reference-for-automated-tests';
    datasetManager.createDatasetLocalFile(datasetName, 'A basic reference dataset for brewery model', 'reference_dataset');
  });
});
