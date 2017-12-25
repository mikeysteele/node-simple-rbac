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
//# sourceMappingURL=InMemoryProvider.js.map