/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict";
var providers;

function getProviders() {
    if (!providers) {
        providers = {};
        providers['ObjectProvider'] = require('./provider/ObjectProvider.js');
        providers['InMemoryProvider'] = require('./provider/InMemoryProvider.js');
    }
    return providers;
}

function resolveProvider(providerConfig) {
    var provider = providerConfig.type || 'InMemoryProvider';
    if (!provider) {
        return provider;
    }
    if (typeof provider === 'object') {
        if (provider.getPermissions instanceof Function === false) {
            throw new Error('Provider object must have getPermissions()');
        }
        if (provider.setConfig instanceof Function) {
            provider.setConfig(providerConfig);
        }
        return provider;
    }
    var providerInstance = getProviders()[provider];
    if (providerInstance.setConfig instanceof Function) {
        providerInstance.setConfig(providerConfig);
    }
    return providerInstance;
}

function rbac(config) {
    this.guards = config.guards || {};
    this.assertions = config.assertions || {};
    this.provider = resolveProvider(config.provider);
}
rbac.prototype.IsGranted = function(user, permission, resource) {
    var self = this;
    return new Promise(function(resolve, reject) {
        self.provider.getPermissions(user).then(function(GrantedPermissions) {
            if (GrantedPermissions.indexOf(permission) > -1) {
                if (resource) {
                    self._assert(user, permission, resource).then(function(status) {
                        resolve(status);
                    }, function(e) {
                        reject({
                            error: 'Assertion Failed to complete',
                            detail: e
                        });
                    });
                } else {
                    resolve(true);
                }
            } else {
                resolve(false);
            }
        }, function(err) {
            reject({
                error: 'Provider failed to get permissions',
                detail: err
            });
        });
    });
};
rbac.prototype._assert = function(user, permission, resource) {
    var assertion = this.assertions[permission];
    var self = this;
    return new Promise(function(resolve, reject) {
        if (assertion) {
            if (typeof assertion === 'function') {
                assertion(self, user, resource, function(success) {
                    resolve(success);
                    return;
                }, function(e) {
                    reject(e);
                });
            } else {
                reject('Assertion was not callable');
            }
        } else {
            resolve(true);
        }
    });
};
module.exports = rbac;
