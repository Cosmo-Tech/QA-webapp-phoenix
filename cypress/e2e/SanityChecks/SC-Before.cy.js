import 'cypress-file-upload';
const connection = require('../../functions/connect.cy.js');
const datasetManager = require('../../functions/datasetManager.cy.js');
const config = require('../../../variables.cy.js');
const scenario = require('../../functions/scenario.cy.js');

let testData;

describe('To run before any automated sanity check', () => {
  before(() => {
    cy.fixture('lightTestData').then((data) => {
      testData = data;
    });
  });
  it('PROD-12902: Check the behavior if no dataset', () => {
    //There should not be any dataset after the cleaning of the previous campaign. If a dataset remains:
    // 1. If volunteer, ignore this test fail
    // 2. If manually added, delete it by using the test "ConnectOnly" and manually delete
    // 3. If from the previous test campaign, add the forgotten dataset to the "After" file so it will be removed in the future
    connection.connect();
    connection.navigate('dataset');
    cy.get(`[data-cy="${testData.ui.noDatasets.placeholder}"]`).should('exist');
    cy.get(`[data-cy="${testData.ui.noDatasets.placeholder}"]`).should('contain', testData.ui.noDatasets.title);
    cy.get(`[data-cy="${testData.ui.noDatasets.subtitle.selector}"]`).should('exist');
    cy.get(`[data-cy="${testData.ui.noDatasets.subtitle.selector}"]`).should('contain', testData.ui.noDatasets.subtitle.textParts[0]);
    cy.get(`[data-cy="${testData.ui.noDatasets.subtitle.selector}"]`).should('contain', testData.ui.noDatasets.subtitle.textParts[1]);
    cy.get(`[data-cy="${testData.ui.noDatasets.createButton}"]`).should('exist');
    cy.get(`[data-cy="${testData.ui.noDatasets.createButton}"]`).should('not.be.disabled');
  });

  it('Create a dataset for any scenario creations during the automated tests', () => {
    //Create a dataset that will be needed during all test that create scenarios with no specific dataset required. This dataset will be removed at the end of the tests in the After.cy.js tests.
    connection.connect();
    connection.navigate('dataset');
    // No need to remove in case of second try, as the function "createDataset" already checks and removes if a dataset with the same name exists
    datasetManager.createDatasetLocalFile(testData.datasets.reference.name, testData.datasets.reference.description, testData.datasets.reference.fileType);
    datasetManager.shareDatasetWithQATeam(testData.datasets.reference.name, testData.sharing.qaTeam.role);
  });

  it('Create another dataset with more data for some data tests', () => {
    //Create a dataset with more data (500 customers) for the parameters checks.
    connection.connect();
    connection.navigate('dataset');
    // Remove in case it's a second try, as the function "createDataset" already checks and removes if a dataset with the same name exists
    datasetManager.createDatasetLocalFile(testData.datasets.barcelona.name, testData.datasets.barcelona.description, testData.datasets.barcelona.fileType);
    datasetManager.shareDatasetWithQATeam(testData.datasets.barcelona.name, testData.sharing.qaTeam.role);
  });

  // Clean all scenario to have the "no scenario" messages in different screens
  it('Delete All Scenario', () => {
    connection.connect();
    // Create a fake scenario so it won't fail due to "no scenario issue"
    scenario.createScenario(testData.scenarios.deletion.name, testData.scenarios.deletion.branch, testData.datasets.reference.name, testData.scenarios.deletion.parameters);
    scenario.deleteAllScenario();
});
});