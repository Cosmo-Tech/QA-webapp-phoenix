import { VpnKey } from '@mui/icons-material';
import 'cypress-file-upload';
var connection = require('../functions/connect.cy.js');
var datasetManager = require('../functions/datasetManager.cy.js');
var scenario = require('../functions/scenario.cy.js');

describe('There are only tests of tests, not real tests', () => {
  it('test something', () => {
    connection.connect();
    connection.navigate('about');
    cy.get('[role="dialog"]').should('exist');
    cy.get('[data-cy="about-dialog-close-button"]').click();
    connection.navigate('help');
    cy.url().should('contain', 'https://cosmotech.okta.com/');
  });

  /*it('recover URL', () => {
    connection.connect();
    connection.navigate('scenario-view');
    cy.url().then((scenarioURL) => {
      var scenarioID = scenarioURL;
      console.log(scenarioURL);
    });
    //var testURL = cy.url();
    //console.log(testURL);
    //cy.log('URL = ' + URL);
  });*/
});
