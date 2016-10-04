/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict";
var roleKey;
var permissionKey;
var permissionName;
module.exports.setConfig = function(config){
    roleKey = config.roleKey;
    permissionKey = config.permissionKey;
    permissionName = config.permissionName;
};
module.exports.getPermissions = function(object) {
    var permissions  = [];
    var roles = [];
    return new Promise(function(resolve, reject) {       
        try{
            if (object[roleKey] instanceof Array === false){
                roles = [object[roleKey]];
            }else{
                roles = object[roleKey];
            };
            roles.forEach(function(role){
                if (role[permissionKey] instanceof Array){
                    permissions = flatternPermissions(role[permissionKey])     
                };
            });
            if (object[permissionKey] instanceof Array){
                permissions = permissions.concat(flatternPermissions(object[permissionKey]));     
            };
            resolve(permissions);
        }catch(e){
            reject(e);
        }
    });
};

function flatternPermissions(permissions){
    return permissions.map(function(permission){
        if (typeof permission === 'string'){
            return permission;
        }
        return permission[permissionName];
    });
}
