// Declare the variables used to launch tests

//URL where the tests will be performed
var urlWebApp = 'http://localhost:3000';

//URL of the API used by the webapp
var urlAPI = 'https://dev.api.cosmotech.com';

//Which worspace would you like to work on? Enter the workspace ID.
var workspace = 'w-70klgqeroooz';

//Who will be the person testing the permissions (user who will be used to set the permissions and who will have to check after the tests)
var permissionUserEmail = 'fanny.silencieux@cosmotech.com';
// Name is fist and last name aglomerated (ie. john doe => johndoe)
var permissionUserName = 'fannysilencieux';

// The following functions are just a way to recover the variables in another files for later use. No need to modify anything after this comment line.
class ConfigTest {
  static urlWebApp() {
    return urlWebApp;
  }

  static urlAPI() {
    return urlAPI;
  }

  static workspace() {
    return workspace;
  }

  static permissionUserEmail() {
    return permissionUserEmail;
  }

  static permissionUserName() {
    return permissionUserName;
  }
}

module.exports = ConfigTest;
