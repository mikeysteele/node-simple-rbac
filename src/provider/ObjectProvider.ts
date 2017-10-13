/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import { IProvider } from './IProvider';

export class ObjectProvider implements IProvider {

    private _roleKey;
    private _permissionKey;
    private _permissionName;


    private _flatternPermissions(permissions) {
        return permissions.map(function (permission) {
            if (typeof permission === 'string') {
                return permission;
            }
            return permission[this._permissionName];
        });
    }
    public setConfig(config) {
        this._roleKey = config.roleKey;
        this._permissionKey = config.permissionKey;
        this._permissionName = config.permissionName;
    }

    public getPermissions(object) {
        let permissions = [];
        let roles = [];
        return new Promise((resolve, reject) => {
            try {
                if (object[this._roleKey] instanceof Array === false) {
                    roles = [object[this._roleKey]];
                } else {
                    roles = object[this._roleKey];
                };
                roles.forEach((role) => {
                    if (role[this._permissionKey] instanceof Array) {
                        permissions = this._flatternPermissions(role[this._permissionKey])
                    };
                });
                if (object[this._permissionKey] instanceof Array) {
                    permissions = permissions.concat(this._flatternPermissions(object[this._permissionKey]));
                };
                resolve(permissions);
            } catch (e) {
                reject(e);
            }
        });
    }
}