import 'cypress-file-upload';
var connection = require('../functions/connect.cy.js');
var datasetManager = require('../functions/datasetManager.cy.js');
var scenario = require('../functions/scenario.cy.js');

describe('Dataset Manager Sanity Checks', () => {
  it('PROD-12909 -> Create from Local File', () => {
    connection.connect();
    //connection.navigate('scenario-view');
    //scenario.createScenario('TestCreateScenario', 'master', 'SharingTest', 'NoParameters');
    connection.navigate('manager');
    cy.get('DeleteForeverIcon').each(($el) => {
      cy.wrap($el).click();
    });
  });
});
