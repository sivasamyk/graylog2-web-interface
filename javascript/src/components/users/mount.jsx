'use strict';

var React = require('react');
var UserPreferencesButton = require('./UserPreferencesButton');
var UserPreferencesModal = require('./UserPreferencesModal');
var UserList = require('./UserList');
var RolesComponent = require('./RolesComponent');
var LdapGroupsComponent = require('./LdapGroupsComponent');

var editUserPreferencesButton = document.getElementById('react-user-preferences-button');
var editUserPreferences = document.getElementById('react-user-preferences-modal');

if (editUserPreferences && editUserPreferencesButton) {
    var userName = editUserPreferencesButton.getAttribute('data-user-name');
    var modal = React.render(<UserPreferencesModal userName={userName}/>, editUserPreferences);
    React.render(<UserPreferencesButton modal={modal} />, editUserPreferencesButton);
}

var userList = document.getElementById('react-user-list');

if (userList) {
    React.render(<UserList currentUsername={userList.getAttribute('data-current-username')}/>, userList);
}

var roleList = document.getElementById('react-roles-component');

if (roleList) {
    React.render(<RolesComponent />, roleList);
}

var ldapgroups = document.getElementById('react-ldapgroups-component');

if (ldapgroups) {
    React.render(<LdapGroupsComponent />, ldapgroups);
}

