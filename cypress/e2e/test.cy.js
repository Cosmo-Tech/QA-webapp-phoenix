import 'cypress-file-upload';
var connection = require('../functions/connect.cy.js');
var datasetManager = require('../functions/datasetManager.cy');

describe('Dataset Manager Sanity Checks', () => {
  it('PROD-12909 -> Create from Local File', () => {
    connection.connect();
    connection.navigate('dataset');
    datasetManager.selectDataset('SharingTest');
    cy.get('[data-testid="ShareIcon"]').click();
    cy.get('[placeholder="Add people"]').click().type('personne');
    cy.get('[data-cy*="share-scenario-dialog-agents-select-"]').should('not.exist');

    //datasetManager.createDatasetLocalFile('SharingTest', 'A dataset to test the sharing', 'reference_dataset');
    //datasetManager.shareDatasetUser('SharingTest', 'raphael.durville@cosmotech.com', 'raphaeldurville', 'viewer');
    //datasetManager.updateDatasetUser('SharingTest', 'raphael.durville@cosmotech.com', 'raphaeldurville', 'editor');
    //datasetManager.removeDatasetPermissionsUser('SharingTest', 'raphael.durville@cosmotech.com', 'raphaeldurville');
    //datasetManager.updateDatasetGlobal('SharingTest', 'viewer');
    //datasetManager.removeDatasetPermissionsGlobal('SharingTest');
    //datasetManager.updateDatasetUser('SharingTest', 'fanny.silencieux@cosmotech.com', 'fannysilencieux', 'admin');
  });
});
