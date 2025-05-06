import 'cypress-file-upload';
const connection = require('../../functions/connect.cy.js');
const datasetManager = require('../../functions/datasetManager.cy.js');
const config = require('../../../variables.cy.js');
const scenario = require('../../functions/scenario.cy.js');

describe('To run before any automated sanity check', () => {
  it('Create a dataset for any scenario creations during the automated tests', () => {
    //Create a dataset that will be needed during all test that create scenarios with no specific dataset required. This dataset will be removed at the end of the tests in the After.cy.js tests.
    connection.connect();
    connection.navigate('dataset');
    const datasetName = 'DLOP-Reference-for-automated-tests';
    // Remove in case it's a second try
    datasetManager.deleteDataset(datasetName);
    datasetManager.createDatasetLocalFile(datasetName, 'A basic reference dataset for brewery model', 'reference');
    datasetManager.shareDatasetUser(datasetName, config.permissionUserEmail(), config.permissionUserName(), 'admin');
  });

  // Clean all scenario to have the "no scenario" messages in different screens
  it('Delete All Senario | May fail if no scenario', () => {
    connection.connect();
    // Create a fake scenario so it won't fail due to "no scenario issue"
    scenario.createScenario('DLOP-ScenarioForDeletion', 'master', 'DLOP-Reference-for-automated-tests', 'BreweryParameters');
    scenario.deleteAllScenario();
  });
});
