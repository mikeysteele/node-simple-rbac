/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import { IProvider } from './IProvider';

export class InMemoryProvider implements IProvider {

    private _roles;

    public setConfig(config) {
        this._roles = config.roles
    }

    getPermissions(user) {
        const role = user.role;
        return new Promise((resolve, reject) => {
            if (!this._roles) {
                reject("roles not set");
            } else if (!role) {
                reject("no role passed");
            } else if (typeof role !== 'string') {
                reject('role needs to be a string');
            } else {
                resolve(this._roles[role]);
            }
        });
    }
}