import 'cypress-file-upload';
var connection = require('../functions/connect.cy.js');
var datasetManager = require('../functions/datasetManager.cy.js');
var scenario = require('../functions/scenario.cy.js');

describe('Dataset Manager Sanity Checks', () => {
  it('PROD-12909 -> Create from Local File', () => {
    connection.connect();
    //connection.navigate('view');
    //scenario.createScenario('TestCreateScenario', 'master', 'SharingTest', 'NoParameters');
    connection.navigate('manager');
    scenario.deleteScenario('TestCreateScenario');
    //datasetManager.createDatasetLocalFile('SharingTest', 'A dataset to test the sharing', 'reference_dataset');
    //datasetManager.shareDatasetUser('SharingTest', 'raphael.durville@cosmotech.com', 'raphaeldurville', 'viewer');
    //datasetManager.updateDatasetUser('SharingTest', 'raphael.durville@cosmotech.com', 'raphaeldurville', 'editor');
    //datasetManager.removeDatasetPermissionsUser('SharingTest', 'raphael.durville@cosmotech.com', 'raphaeldurville');
    //datasetManager.updateDatasetGlobal('SharingTest', 'viewer');
    //datasetManager.removeDatasetPermissionsGlobal('SharingTest');
    //datasetManager.updateDatasetUser('SharingTest', 'fanny.silencieux@cosmotech.com', 'fannysilencieux', 'admin');
  });
});
