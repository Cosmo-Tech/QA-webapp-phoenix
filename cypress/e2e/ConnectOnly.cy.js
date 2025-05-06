import 'cypress-file-upload';
const connection = require('../functions/connect.cy.js');
const datasetManager = require('../functions/datasetManager.cy.js');
const config = require('../../variables.cy.js');
const scenario = require('../functions/scenario.cy.js');

describe('This test will only connect the user to the webapp using the service account, for manual checking', () => {
  it('Connect to the webapp', () => {
    connection.connect();
    connection.navigate('manager');
  });
});
