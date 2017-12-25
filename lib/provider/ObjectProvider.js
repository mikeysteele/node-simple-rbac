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
//# sourceMappingURL=ObjectProvider.js.map