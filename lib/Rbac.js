"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rbac = /** @class */ (function () {
    function Rbac(config) {
        this.config = config;
        this.guards = config.guards || {};
        this.assertions = config.assertions || {};
        this.provider = this._resolveProvider(config.provider);
    }
    Rbac.prototype.IsGranted = function (user, permission, resource) {
        var self = this;
        return self.provider.getPermissions(user).then(function (GrantedPermissions) {
            if (GrantedPermissions.indexOf(permission) > -1) {
                if (resource) {
                    return self._assert(user, permission, resource).then(function (status) {
                        return status;
                    }, function (e) {
                        return Promise.reject({
                            error: 'Assertion Failed to complete',
                            detail: e
                        });
                    });
                }
                else {
                    return true;
                }
            }
            else {
                return false;
            }
        }).catch(function (err) {
            return Promise.reject({
                error: 'Provider failed to get permissions',
                detail: err,
                provider: self.config.provider.type
            });
        });
    };
    ;
    Rbac.prototype._resolveProvider = function (providerConfig) {
        providerConfig.type = providerConfig.type || 'InMemoryProvider';
        var provider = providerConfig.type;
        if (!provider) {
            throw new Error('no provider available');
        }
        if (typeof provider === 'object' && provider !== null) {
            if (provider.getPermissions instanceof Function === false) {
                throw new Error('Provider object must have getPermissions()');
            }
            if (provider.setConfig instanceof Function) {
                provider.setConfig(providerConfig);
            }
            return provider;
        }
        var providerInstance = this._getProviders()[provider];
        if (providerInstance.setConfig instanceof Function) {
            providerInstance.setConfig(providerConfig);
        }
        return providerInstance;
    };
    Rbac.prototype._assert = function (user, permission, resource) {
        var assertion = this.assertions[permission];
        var self = this;
        if (assertion) {
            if (typeof assertion === 'function') {
                return assertion(this, user, resource);
            }
            else {
                return Promise.reject('Assertion was not callable');
            }
        }
        else {
            return Promise.reject(true);
        }
    };
    ;
    Rbac.prototype._getProviders = function () {
        if (!this.providers) {
            this.providers = {};
            this.providers['ObjectProvider'] = require('./provider/ObjectProvider.js');
            this.providers['InMemoryProvider'] = require('./provider/InMemoryProvider.js');
        }
        return this.providers;
    };
    return Rbac;
}());
exports.Rbac = Rbac;
//# sourceMappingURL=Rbac.js.map