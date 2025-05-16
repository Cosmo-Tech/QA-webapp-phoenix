import 'cypress-file-upload';
const connection = require('../../functions/connect.cy.js');
const datasetManager = require('../../functions/datasetManager.cy.js');
const config = require('../../../variables.cy.js');
const scenario = require('../../functions/scenario.cy.js');

describe('To run before any automated sanity check', () => {
  it('PROD-12902: Check the behavior if no dataset', () => {
    //There should not be any dataset after the cleaning of the previous campaign. If a dataset remains:
    // 1. If volunteer, ignore this test fail
    // 2. If manually added, delete it by using the test "ConnectOnly" and manually delete
    // 3. If from the previous test campaign, add the forgotten dataset to the "After" file so it will be removed in the future
    connection.connect();
    connection.navigate('dataset');
    cy.get('[data-cy="no-datasets-placeholder"]').should('exist');
    cy.get('[data-cy="no-datasets-placeholder"]').should('contain', "You don't have any datasets yet");
    cy.get('[data-cy="no-datasets-user-subtitle"]').should('exist');
    cy.get('[data-cy="no-datasets-user-subtitle"]').should('contain', 'Click on');
    cy.get('[data-cy="no-datasets-user-subtitle"]').should('contain', 'to import your first data');
    cy.get('[data-cy="create-dataset-button"]').should('exist');
    cy.get('[data-cy="create-dataset-button"]').should('not.be.disabled');
  });

  it('Create a dataset for any scenario creations during the automated tests', () => {
    //Create a dataset that will be needed during all test that create scenarios with no specific dataset required. This dataset will be removed at the end of the tests in the After.cy.js tests.
    connection.connect();
    connection.navigate('dataset');
    const datasetName = 'DLOP-Reference-for-automated-tests';
    // No need to remove in case of second try, as the function "createDataset" already check and remove if dataset with same nam
    datasetManager.createDatasetLocalFile(datasetName, 'A basic reference dataset for brewery model', 'reference');
    datasetManager.shareDatasetUser(datasetName, config.permissionUserEmail(), config.permissionUserName(), 'admin');
  });

  it('Create another dataset with more data for some data tests', () => {
    //Create a dataset with more data (500 customers) for the parameters checks.
    connection.connect();
    connection.navigate('dataset');
    const datasetName = 'DLOP-Barcelona-for-automated-tests';
    // Remove in case it's a second try
    // No need to remove in case of second try, as the function "createDataset" already check and remove if dataset with same nam
    datasetManager.createDatasetLocalFile(datasetName, 'A dataset with 500 customers for brewery model', 'barcelona');
    datasetManager.shareDatasetUser(datasetName, config.permissionUserEmail(), config.permissionUserName(), 'admin');
  });

  // Clean all scenario to have the "no scenario" messages in different screens
  it('Delete All Senario', () => {
    connection.connect();
    // Create a fake scenario so it won't fail due to "no scenario issue"
    scenario.createScenario('DLOP-ScenarioForDeletion', 'master', 'DLOP-Reference-for-automated-tests', 'BreweryParameters');
    scenario.deleteAllScenario();
  });
});
