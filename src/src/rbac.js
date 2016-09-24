/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var providers;
var _config;


function getProviders() {
    if (!providers) {
        providers = {};
        providers['ObjectProvider'] = require('./provider/ObjectProvider.js');
        providers['InMemoryProvider'] = require('./provider/InMemoryProvider.js');
    }
    return providers;
}


function resolveProvider(config) {
    provider = config.provider || 'InMemoryProvider';
    if (!provider) {
        return provider;
    }
    if (typeof provider === 'object') {
        if (!provider.getPermissions instanceof Function){
            throw new Error('Provider object must have getPermissions()');
        }
        if (provider.setConfig instanceof Function){
            provider.setConfig(config);
        }
        return provider;
    }
    var providerInstance = getProviders()[provider];
    if (providerInstance.setConfig instanceof Function){
            providerInstance.setConfig(config);
    }
       
   
    
    return providerInstance;

}

function rbac(config) {
   
    this.guards = config.guards || {};
    this.assertions = config.assertions || {};
    this.provider = resolveProvider(config);
}

rbac.prototype.IsGranted = function (userOrRoll, permission,resource) {
    var self = this;
    return new Promise(function (fulfill, reject) {    
        self.provider.getPermissions(userOrRoll).then(function (GrantedPermissions) {
            if (GrantedPermissions.indexOf(permission) > -1) {
                if (resource){
                    self._assert(userOrRoll, permission, resource).then(function(status){
                        fulfill(status);
                    }, function(e){
                        console.log('rejecting');
                        reject(e);
                    });
                }else{
                     fulfill(true);
                }

            }else{
                fulfill(false);
            }
                      
        },function(err){
               console.log('error in assertion');
            reject(err);
        });
    });
};

rbac.prototype._assert = function (user, permission, resource) {
    var assertion = this.assertions[permission];
    var self = this;
    return new Promise(function (fulfill, reject) {
        if (assertion) {
            if (typeof assertion === 'function') {
                assertion(self, user, resource, function (success) {
                    fulfill(success);
                    return;
                }, function(e){
                    
                    reject(e);
                });
            } else {
                reject('Assertion was not callable');
            }
        } else {
            fulfill(true);

        }
    });
};

module.exports = rbac;