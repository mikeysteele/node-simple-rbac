(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var Rbac = require('./lib/Rbac.js').Rbac;
if (typeof window !== 'undefined'){
    window.Rbac = Rbac;
}
module.exports = Rbac;


},{"./lib/Rbac.js":2}],2:[function(require,module,exports){
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

},{"./provider/InMemoryProvider.js":3,"./provider/ObjectProvider.js":4}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InMemoryProvider = /** @class */ (function () {
    function InMemoryProvider() {
    }
    InMemoryProvider.prototype.setConfig = function (config) {
        this._roles = config.roles;
    };
    InMemoryProvider.prototype.getPermissions = function (user) {
        var _this = this;
        var role = user.role;
        return new Promise(function (resolve, reject) {
            if (!_this._roles) {
                reject("roles not set");
            }
            else if (!role) {
                reject("no role passed");
            }
            else if (typeof role !== 'string') {
                reject('role needs to be a string');
            }
            else {
                resolve(_this._roles[role]);
            }
        });
    };
    return InMemoryProvider;
}());
exports.InMemoryProvider = InMemoryProvider;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ObjectProvider = /** @class */ (function () {
    function ObjectProvider() {
    }
    ObjectProvider.prototype._flatternPermissions = function (permissions) {
        return permissions.map(function (permission) {
            if (typeof permission === 'string') {
                return permission;
            }
            return permission[this._permissionName];
        });
    };
    ObjectProvider.prototype.setConfig = function (config) {
        this._roleKey = config.roleKey;
        this._permissionKey = config.permissionKey;
        this._permissionName = config.permissionName;
    };
    ObjectProvider.prototype.getPermissions = function (object) {
        var _this = this;
        var permissions = [];
        var roles = [];
        return new Promise(function (resolve, reject) {
            try {
                if (object[_this._roleKey] instanceof Array === false) {
                    roles = [object[_this._roleKey]];
                }
                else {
                    roles = object[_this._roleKey];
                }
                ;
                roles.forEach(function (role) {
                    if (role[_this._permissionKey] instanceof Array) {
                        permissions = _this._flatternPermissions(role[_this._permissionKey]);
                    }
                    ;
                });
                if (object[_this._permissionKey] instanceof Array) {
                    permissions = permissions.concat(_this._flatternPermissions(object[_this._permissionKey]));
                }
                ;
                resolve(permissions);
            }
            catch (e) {
                reject(e);
            }
        });
    };
    return ObjectProvider;
}());
exports.ObjectProvider = ObjectProvider;

},{}]},{},[1]);
