/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict";
var _roles;
module.exports.setConfig = function(config) {
    _roles = config.roles;
};
module.exports.getPermissions = function(user) {
    var role = user.role;
    return new Promise(function(resolve, reject) {
        if (!_roles) {
            reject("roles not set");
        } else if (!role) {
            reject("no role passed");
        } else if (typeof role !== 'string') {
            reject('role needs to be a string');
        } else {
            resolve(_roles[role]);
        }
    });
};
