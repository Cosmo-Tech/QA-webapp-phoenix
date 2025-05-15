import 'cypress-file-upload';
const connection = require('../../../functions/connect.cy.js');
const datasetManager = require('../../../functions/datasetManager.cy.js');
const config = require('../../../../variables.cy.js');
const scenario = require('../../../functions/scenario.cy.js');

describe('Editable Tables Parameters', () => {
  it('PROD-13878: Edit a scenario', () => {
    connection.connect();
    // Remove scenarios in case it's a second try
  });
});
