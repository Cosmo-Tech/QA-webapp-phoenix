import { Login } from '../commons/actions/generic';

class ConnectToWebApp {
  //This function connect a generic user so it is possible to navigate in the solution for other tests
  static connect() {
    Login.login();
    // Check the connection is done and you're on the landing page
    cy.url().should('contains', 'workspaces');

    // Set the language to English so cypress can assert texts with no confusion with French.
    // Navigate through the menu to reach the language parameters
    cy.get('[data-cy="user-profile-menu"]').click({ force: true });
    cy.get('[data-cy="change-language"]').click({ force: true });
    // Set language
    cy.get('[data-cy="set-lang-en"]').click({ force: true });
  }

  static logout() {
    cy.get('[data-cy="user-profile-menu"]').click({ force: true });
    cy.get('[data-cy="logout"]').click({ force: true });
  }

  // Accepted values are view, dashboards, manager and about
  static navigate(menuValue) {
    if (menuValue === 'view') {
      cy.get('[data-cy="tabs.scenario.key"]').click({ force: true });
      cy.url().should('contains', 'scenario');
    } else if (menuValue === 'dashboards') {
      cy.get('[data-cy="tabs.dashboards.key"]').click({ force: true });
      cy.url().should('contains', 'dashboards');
    } else if (menuValue === 'manager') {
      cy.get('[data-cy="tabs.scenariomanager.key"]').click({ force: true });
      cy.url().should('contains', 'scenariomanager');
    } else if (menuValue === 'about') {
      cy.get('[data-testid="HelpOutlineIcon"]').click({ force: true });
      cy.get('[data-cy="about-button"]').click({ force: true });
    } else {
      cy.log('Unknown menu. This function accept only "view", "dashboards", "manager" or "about" as values.');
    }
  }

  static language(languageValue) {
    if (languageValue === 'EN') {
      // Navigate through the menu to reach the language parameters
      cy.get('[data-cy="user-profile-menu"]').click({ force: true });
      cy.get('[data-cy="change-language"]').click({ force: true });
      // Set language
      cy.get('[data-cy="set-lang-en"]').click({ force: true });
    } else if (languageValue === 'FR') {
      // Navigate through the menu to reach the language parameters
      cy.get('[data-cy="user-profile-menu"]').click({ force: true });
      cy.get('[data-cy="change-language"]').click({ force: true });
      // Set language
      cy.get('[data-cy="set-lang-fr"]').click({ force: true });
    } else {
      cy.log('Unknown language. This function accept only "EN" or "FR" as values.');
    }
  }
}

module.exports = ConnectToWebApp;
