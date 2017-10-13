(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var rbac = /** @class */ (function () {
        function rbac(config) {
            this.config = config;
            this.guards = config.guards || {};
            this.assertions = config.assertions || {};
            this.provider = this._resolveProvider(config.provider);
        }
        rbac.prototype.IsGranted = function (user, permission, resource) {
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
        rbac.prototype._resolveProvider = function (providerConfig) {
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
        rbac.prototype._assert = function (user, permission, resource) {
            var _this = this;
            var assertion = this.assertions[permission];
            var self = this;
            return new Promise(function (resolve, reject) {
                if (assertion) {
                    if (typeof assertion === 'function') {
                        assertion(_this, user, resource, function (success) {
                            resolve(success);
                            return;
                        }, function (e) { return reject(e); });
                    }
                    else {
                        reject('Assertion was not callable');
                    }
                }
                else {
                    resolve(true);
                }
            });
        };
        ;
        rbac.prototype._getProviders = function () {
            if (!this.providers) {
                this.providers = {};
                this.providers['ObjectProvider'] = require('./provider/ObjectProvider.js');
                this.providers['InMemoryProvider'] = require('./provider/InMemoryProvider.js');
            }
            return this.providers;
        };
        return rbac;
    }());
    exports.default = rbac;
    module.exports = rbac;
});
//# sourceMappingURL=rbac.js.map